import { TestBed } from '@angular/core/testing';

import { PythonService } from './python.service';

describe('PythonService', () => {
  let service: PythonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PythonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should evaluate double quoted string expressions', () => {
    expect(service.eval('"anything"', {})).toEqual('anything')
  })

  it('should evaluate single quoted string expressions', () => {
    expect(service.eval('\'anything\'', {})).toEqual('anything')
  })

  it('should evaluate True / False', () => {
    expect(service.eval('True', {})).toEqual(true)
    expect(service.eval('False', {})).toEqual(false)
  })

  it('should evaluate numbers', () => {
    expect(service.eval('1', {})).toEqual(1)
  })

  it('should evaluate variables', () => {
    expect(service.eval('my_var', {'my_var': 'yo!'})).toEqual('yo!')
  })

  it('should handle the not opperator', () => {
    expect(service.eval('not True', {})).toEqual(false)
    expect(service.eval('not(True)', {})).toEqual(false)
    expect(service.eval('not(var)', {"var":true})).toEqual(false)
    expect(service.eval('not(var)', {"var":false})).toEqual(true)
  })

  it ('should disregard parens if completely surrounding an expression', () => {
    expect(service.eval('("any old thing")', {})).toEqual("any old thing")
  })


  it ('should handle dot notation', () => {
    let ctx = {"a": {"b": { "c": true }}}
    expect(service.eval('a.b.c', ctx)).toEqual(true)
    expect(service.eval('not a.b.c', ctx)).toEqual(false)
  })

  it ('should handle comparisons', () => {
    expect(service.eval('1 == 2', {})).toEqual(false)
    expect(service.eval('1 != 2', {})).toEqual(true)

    let ctx = {"a": {"b": { "c": "Wilma", "d": "Fred"}}}
    expect(service.eval('a.b.c == "Fred"', ctx)).toEqual(false)
    expect(service.eval('a.b.c == "Wilma"', ctx)).toEqual(true)
    expect(service.eval('a.b.c != a.b.d', ctx)).toEqual(true)
  })

  it ('should handle length expressions', () => {
    expect(service.eval('len("apple")', {})).toEqual(5)
    expect(service.eval('len(var)', {var:"apple"})).toEqual(5)
  })

  it ('should handle the "in" or includes operator', () => {
    expect(service.eval('"a" in ["a","b"]', {})).toEqual(true)
    expect(service.eval('"a" in ["b","c"]', {})).toEqual(false)
  })

  /*
  CollStorUVaLocPaperTypes is None or "OtherTypes" not in CollStorUVaLocPaperTypes
   */
  it ('should handle the "not in" or includes operator', () => {
    expect(service.eval('"a" not in ["a","b"]', {})).toEqual(false)
    expect(service.eval('"a" not in ["b","c"]', {})).toEqual(true)
  })

/*
  <camunda:property id="hide_expression" value="not AsApplConsentDocType or consent_docs[AsApplConsentDocType].has_description  != &#34;√&#34;" />
  */
  it ('should handle bracket notation.', () => {
    let ctx = {"alpha":{"beta":{"gamma": "apple"}}, "var": "beta"}
    expect(service.eval('alpha["beta"]["gamma"]', ctx)).toEqual("apple")
    expect(service.eval('alpha[var]["gamma"]', ctx)).toEqual("apple")
  })

  /*  We need to support this use case I suspect.
  it ('should handle get expressions within bracket notation.', () => {
    let ctx = {"alpha":{"beta":{"gamma": "apple"}}, "var": "beta"}
    expect(service.eval('alpha.get("beta").gamma', ctx)).toEqual("apple")
  })
   */

  /*
  <camunda:property id="hide_expression" value="CollStorUVaLocPaperTypes is None or &#34;OtherTypes&#34; not in CollStorUVaLocPaperTypes" />
 */
  it ('should handle is none.', () => {
    let ctx = {"my_check": null}
    expect(service.eval('my_check is None', ctx)).toEqual(true)
  });

/*
    <camunda:property id="hide_expression" value="isIVRSIWRSIXRSMan or RequiredIVRS_IWRS_IXRS == &#34;no&#34; or RequiredIVRS_IWRS_IXRS is None" />
 */
  it ('should handle multiple or statements.', () => {
    let ctx = {"a": null, "b": null, "c": 2}
    expect(service.eval('a or b is not None or c == 2', ctx)).toEqual(true)
  })

  /*
  "" if not AsApplAncillaryDocType else ancillary_docs[AsApplAncillaryDocType]["doczip"]
  */
  it ('should handle the if else expression', () => {
    expect(service.eval('"x" if True else "y"', {})).toEqual(('x'))
    expect(service.eval('"x" if False else "y"', {})).toEqual(('y'))
    expect(service.eval('a if b else c', {"a":"a", "b": true, c:"c"})).toEqual(('a'))
  })

  it ('should handle some complex groupings of expressions', () => {
    //  ex.  not var or var in ["a","b"]
    expect(service.eval('x or var == "c"', {"x": true, "var": "a"})).toEqual(true)
    expect(service.eval('x or var == "c"', {"x": false, "var": "c"})).toEqual(true)
    expect(service.eval('x or var == "c"', {"x": false, "var": "a"})).toEqual(false)

    expect(service.eval('not var or var in ["a","b"]', {"var": "a"})).toEqual(true)
    expect(service.eval('not var or var in ["1","2"]', {"var": "c"})).toEqual(false)
    expect(service.eval('not var or var in ["Z","X"]', {"var": null})).toEqual(true)

    expect(service.eval('not var or var["var2"] != "b"', {"var": {"var2": "a"}})).toEqual(true)
    expect(service.eval('not var or var["var2"] != "a"', {"var": {"var2": "a"}})).toEqual(false)

  })

  it ('should handle startswith method', () => {
    expect(service.eval('"john".startswith("j")', {})).toEqual(true)
    expect(service.eval('"john".startswith("Q")', {})).toEqual(false)
    expect(service.eval('a.b.startswith("c")', {a: {b: "cat"}})).toEqual(true)
    expect(service.eval('a.b.startswith(c)', {a: {b: "cat"}, c:"c"})).toEqual(true)
  })

  it ('should append two strings together', () => {
    expect(service.eval('"this and " + that', {that: "that"})).toEqual("this and that")
  })

});
