import { Injectable } from '@angular/core';
import {ScriptService} from './script.service';
import { cloneDeep } from 'lodash';
import {defer, from, Observable, of} from 'rxjs';
import {not} from 'rxjs/internal-compatibility';

/**
 * Does a very mediocre effort at evaluating short oneline python expressions in Javascript.
 * I did this using Regular Expressions - which is a terrible way to go about this.  Would be far better to use a lexer.
 * There are good tests, so this is really here to be re-written by a better person than I.
 */
@Injectable({providedIn: 'root'})
export class PythonService {

  constructor() {
  }

  isReady() {
    // We are always ready baby. (here because we may want to switch out to the piodide service someday, which is
    // definitely not "always ready"
    return true
  }

  public ready(): Observable<any> {
    return of(null)  // We are always ready.
  }


  /**
   * I am ashamed of this method. It would be far better to tokenize and process.
   * @param expression
   * @param context
   * @param defaultResult
   */
  eval(expression, context, defaultResult = "", original= null) {
    expression = expression.trim()
    if(!original) {
      original = expression
    }

    // If this is True or False, just return that.
    if (expression === 'True') return true;
    if (expression === 'False') return false;
    if (expression === 'None') return null;

    // If this is just a double-quoted string, evaluate it to handle any escaped quotes.
    let match = expression.match(/^"(?:[^"\\]|\\.)*"$/)
    if (match) {
      return eval(expression);
    }

    // If this is just a single-quoted string, evaluate it to handle any escaped quotes.
    let quote_match = expression.match(/^'(?:[^'\\]|\\.)*'$/)
    if (quote_match) {
      return eval(expression);
    }

    // If this is just numbers, eval it.
    let number_match = expression.match(/^\d+$/is)
    if (number_match) {
      return eval(expression);
    }

    // If this is a literal array, eval it.  ie ['a','b']
    let array_match = expression.match(/^\[.*\]$/)
    if (array_match) {
      return eval(expression)
    }

    // If this is surrounded by parens, disregard them.
    let paren_match = expression.match(/^\((.*)\)$/)
    if (paren_match) {
      return this.eval(paren_match[1], context, original);
    }

    // If this is a single world (no spaces).
    // Also, handle any dot notation in the process.
    if (expression.match(/^[\w_\-.]+$/)) {
      return expression.split('.').reduce((o, i) => o[i], context)
    }

    // If this is an expression with bracket syntax, evaluate it.
    // ie var1['property']  or v1['prop1']['subprop'] or even
    // var1[var2]['subprop']
    let braket_match = expression.match(/^(\w+)(\[[\w\'\"-_]+\])+$/)
    if (braket_match) {
      let my_value = context[braket_match[1]]
      let last_match = braket_match[1]
      for (let match of expression.matchAll(/\[(['"]?)([\w-_]+)['"]?\]+/g)){
        if (my_value == null) {
          throw SyntaxError(last_match + " is none, in expression " + expression)
        }
        if(match[1]) {  // for x['y']  where 'y' is a string.
          my_value = my_value[match[2]]
        } else {        // for x[y] where y is a variable.
          my_value = my_value[this.eval(match[2], context, original)]
        }
        last_match = match[2]
      }
      return my_value
    }

    // if this is a start's with expression
    let starts_with_match = expression.match(/^([\"\w\.]+)\.startswith\(((["']?)[^)]+\3)\)$/)
    if (starts_with_match) {
      let base = this.eval(starts_with_match[1], context, original)
      let start = this.eval(starts_with_match[2], context, original)
      if (base && start) {
        return base.startsWith(start)
      } else {
        console.log("Cant' match starts with, missing base or start:", base, start)
      }
    }

    // If this is a get expression. ie dict.get('abc')
/*
    let get_match = expression.match(/^([\"\w\.]+)\.get\(((["']?)[^)]+\3)\)$/)
    if (get_match) {
      let base = this.eval(get_match[1], context)
      let start = this.eval(get_match[2], context)
      return base.get(start)
    }
*/

    // If this is an expression that matches not XXX or not(XXX), where XXX is in the model, eval that.
    let not_match = expression.match(/^not[ \(]([\w\.]+)\)?$/)
    if (not_match) {
      let base = this.eval(not_match[1], context, original)
      if (base == null) {
        return true
      } else {
        return !(base)
      }
    }

    let len_match = expression.match(/^len\((.+)\)$/)
    if (len_match) {
      return this.eval(len_match[1], context, original).length
    }

    let if_else_match = expression.match(/^(.*) if (.*) else (.*)$/)
    if (if_else_match) {
      let condition = this.eval(if_else_match[2], context, original)
      if(condition) {
        return this.eval(if_else_match[1], context, original)
      } else {
        return this.eval(if_else_match[3], context, original)
      }
    }

    let or_match = expression.match(/(.*) (or) ?(.*)$/)
    if (or_match) {
      let arg1 = this.eval(or_match[1], context, original)
      if (arg1) {
        return arg1
      } else {
        return this.eval(or_match[3], context, original)
      }
    }


    // If this contains a comparison, split, eval each side, and compare the two.
    // Perfer to split on comparisons first.
    let compare_match = expression.match(/(.*) ?(\+|==|!=| is ) ?(.*)$/)
    if (compare_match) {
      let arg1 = this.eval(compare_match[1], context, original)
      let arg2 = this.eval(compare_match[3], context, original)
      let comp = compare_match[2]
      if (comp == '+')
        return arg1 + arg2
      else if (comp == '!=')
        return arg1 !== arg2
      else
        return arg1 === arg2
    }

    let not_in_match = expression.match(/(.*) ?( not in ) ?(.*)$/)
    if (not_in_match) {
      let arg1 = this.eval(not_in_match[1], context, original)
      let arg2 = this.eval(not_in_match[3], context, original)
      return !arg2.includes(arg1)
    }

    let and_in_match = expression.match(/(.*) ?( and | in ) ?(.*)$/)
    if (and_in_match) {
      let arg1 = this.eval(and_in_match[1], context, original)
      let arg2 = this.eval(and_in_match[3], context, original)
      let comp = and_in_match[2]
      if (comp == ' and ')
        return arg1 && arg2
      else if (comp == ' in ')
        return arg2.includes(arg1)
    }

    let error_message = "unable to evaluate expression " + expression
    if(expression != original) {
      error_message += ".  A portion of original expression " + original;
    }

    console.error(error_message)
    if (defaultResult === "no_default") {
      throw SyntaxError(error_message)
    } else {
      return defaultResult
    }
  }
}
