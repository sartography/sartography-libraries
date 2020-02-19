import {NgModule} from '@angular/core';
import {SartographyWorkflowLibComponent} from './components/sartography-workflow-lib.component';
import {SessionRedirectComponent} from './components/session-redirect/session-redirect.component';
import {MockEnvironment} from './testing/mocks/environment.mocks';


@NgModule({
  declarations: [
    SartographyWorkflowLibComponent,
    SessionRedirectComponent,
  ],
  imports: [],
  exports: [SartographyWorkflowLibComponent],
  providers: [{provide: 'APP_ENVIRONMENT', useClass: MockEnvironment}]
})
export class SartographyWorkflowLibModule {
}
