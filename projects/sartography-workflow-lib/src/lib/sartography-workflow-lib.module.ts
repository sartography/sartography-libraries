import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {ApiErrorsComponent} from './components/api-errors/api-errors.component';
import {SartographyWorkflowLibComponent} from './components/sartography-workflow-lib.component';
import {SessionRedirectComponent} from './components/session-redirect/session-redirect.component';
import {MockEnvironment} from './testing/mocks/environment.mocks';


@NgModule({
  declarations: [
    ApiErrorsComponent,
    SartographyWorkflowLibComponent,
    SessionRedirectComponent,
  ],
  imports: [
    MatListModule,
    MatIconModule,
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
  ],
  exports: [
    ApiErrorsComponent,
    SartographyWorkflowLibComponent,
    SessionRedirectComponent,
  ],
  providers: [{provide: 'APP_ENVIRONMENT', useClass: MockEnvironment}]
})
export class SartographyWorkflowLibModule {
}
