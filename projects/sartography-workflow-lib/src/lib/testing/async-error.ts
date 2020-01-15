/** Create async observable error that errors
 *  after a JS engine turn */
import {defer} from 'rxjs';

export function asyncError<T>(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}
