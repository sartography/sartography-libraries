import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unescapeLineBreaks'
})
export class UnescapeLineBreaksPipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    return value
      .split('\\r\\n')
      .join('\n')
      .split('\\n')
      .join('\n');
  }

}
