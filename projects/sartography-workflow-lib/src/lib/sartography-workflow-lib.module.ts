import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {ApiErrorsComponent} from './components/api-errors/api-errors.component';
import {SartographyWorkflowLibComponent} from './components/sartography-workflow-lib.component';
import {SessionRedirectComponent} from './components/session-redirect/session-redirect.component';
import {FormlyTestComponent} from './testing/formly/component-factory';
import {MockEnvironment} from './testing/mocks/environment.mocks';
import {HIGHLIGHT_OPTIONS, HighlightModule} from 'ngx-highlightjs';
import {MatExpansionModule} from '@angular/material/expansion';

// @dynamic
export function import_json() {
  import('highlight.js/lib/languages/json.js');
}

@NgModule({
  declarations: [
    ApiErrorsComponent,
    SartographyWorkflowLibComponent,
    SessionRedirectComponent,
    FormlyTestComponent,
  ],
  imports: [
    MatListModule,
    MatIconModule,
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    HighlightModule,
    MatExpansionModule
  ],
  exports: [
    ApiErrorsComponent,
    SartographyWorkflowLibComponent,
    SessionRedirectComponent,
    FormlyTestComponent,
  ],
  providers: [
    {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        languages: import_json()
      }
    },
  ]
})
export class SartographyWorkflowLibModule {
}
