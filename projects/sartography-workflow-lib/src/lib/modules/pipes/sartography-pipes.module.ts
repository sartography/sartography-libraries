import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {CleanUpLdapPropertiesPipe} from './clean-up-ldap-properties.pipe';
import {ToFormlyPipe} from './to-formly.pipe';
import {UnescapeLineBreaksPipe} from './unescape-line-breaks.pipe';


@NgModule({
  declarations: [
    ToFormlyPipe,
    UnescapeLineBreaksPipe,
    CleanUpLdapPropertiesPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ToFormlyPipe,
    UnescapeLineBreaksPipe,
    CleanUpLdapPropertiesPipe,
  ]
})
export class SartographyPipesModule {
}
