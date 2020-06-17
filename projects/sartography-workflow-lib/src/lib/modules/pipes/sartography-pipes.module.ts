import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {CleanUpLdapPropertiesPipe} from './clean-up-ldap-properties.pipe';
import {OrdinalPipe} from './ordinal.pipe';
import {ToFormlyPipe} from './to-formly.pipe';
import {UnescapeLineBreaksPipe} from './unescape-line-breaks.pipe';


@NgModule({
  declarations: [
    CleanUpLdapPropertiesPipe,
    OrdinalPipe,
    ToFormlyPipe,
    UnescapeLineBreaksPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CleanUpLdapPropertiesPipe,
    OrdinalPipe,
    ToFormlyPipe,
    UnescapeLineBreaksPipe,
  ]
})
export class SartographyPipesModule {
}
