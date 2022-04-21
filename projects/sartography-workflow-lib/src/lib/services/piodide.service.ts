import { Injectable } from '@angular/core';
import {ScriptService} from './script.service';
import {defer, from, Observable} from 'rxjs';

/**
 * NOT CURRENTLY IN USE:
 * Uses piodide (a Web Assembly based library) to execute python expressions or programs.
 * This proved to be too slow to use in practice, so we had to go a different route for hide-expressions
 * HOWEVER, I suspect this will be very useful to us in the BPMN editor at some point.  So keeping it around.
 */
@Injectable({providedIn: 'root'})
export class PiodideService {
  private pyodide: any
  private readyPromise: Promise<any>

  constructor(private scriptService: ScriptService) {
    this.readyPromise = this.load();
  }

  /** Use this to determine if the service is ready for use.
   */
  public ready(): Observable<any> {
    return defer(() => from(this.readyPromise));
  }

  public isReady() {
    return this.pyodide != null
  }

  public async load() {
    await this.scriptService.load('pyodide')
    let loadPyodide = window["loadPyodide"];
    let pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.19.1/full/",
    });
    this.pyodide = pyodide;
    this.pyodide.runPython(this.python_box_class)
    return pyodide;
  }

  eval(expression, context, defaultResult) {
    if(this.pyodide == null) {
      throw("Pyodide has not completed loading.")
    }
    try {
      this.setContext(context)
      let result = this.pyodide.runPython(expression);
      return result
    } catch (err) {
      console.log("Failed to evaluate expression.", expression, err, context)
      return defaultResult
    }
  }

  setContext(context) {
    this.pyodide.globals.set("my_globals", context)
    this.pyodide.runPython(`
globals_dict = my_globals.to_py()
for k, v in globals_dict.items():
    if isinstance(v, dict):
        v = Box(v)
    globals()[k] = v`);
  }

  /**
   * Taken from SpiffWorkflow - this is a pythonic way to allow access to a dictionary with dot notation
   * as well as a dictionary.  so my_box.attribute and my_box['attribute'] are the same thing.
   */
  private python_box_class = (`
class Box(dict):
  """
  Example:
  m = Box({'first_name': 'Eduardo'}, last_name='Pool', age=24, sports=['Soccer'])
  """

  def __init__(self, *args, **kwargs):
      super(Box, self).__init__(*args, **kwargs)
      for arg in args:
          if isinstance(arg, dict):
              for k, v in arg.items():
                  if isinstance(v, dict):
                      self[k] = Box(v)
                  else:
                      self[k] = v

      if kwargs:
          for k, v in kwargs.items():
              if isinstance(v, dict):
                  self[k] = Box(v)
              else:
                  self[k] = v

  def __deepcopy__(self, memodict=None):
      if memodict is None:
          memodict = {}
      my_copy = Box()
      for k, v in self.items():
          my_copy[k] = copy.deepcopy(v)
      return my_copy

  def __getattr__(self, attr):
      try:
          output = self[attr]
      except:
          raise AttributeError(
              "Dictionary has no attribute '%s' " % str(attr))
      return output

  def __setattr__(self, key, value):
      self.__setitem__(key, value)

  def __setitem__(self, key, value):
      super(Box, self).__setitem__(key, value)
      self.__dict__.update({key: value})

  def __getstate__(self):
      return self.__dict__

  def __setstate__(self, state):
      self.__init__(state)

  def __delattr__(self, item):
      self.__delitem__(item)

  def __delitem__(self, key):
      super(Box, self).__delitem__(key)
      del self.__dict__[key]

`)

}
