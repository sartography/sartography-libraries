import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ToFormlyPipe} from './to-formly.pipe';
import {UnescapeLineBreaksPipe} from './unescape-line-breaks.pipe';


@NgModule({
  declarations: [
    ToFormlyPipe,
    UnescapeLineBreaksPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ToFormlyPipe,
    UnescapeLineBreaksPipe,
  ]
})
export class SartographyPipesModule {
}
