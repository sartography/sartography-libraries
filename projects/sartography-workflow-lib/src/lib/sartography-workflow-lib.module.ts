import { NgModule } from '@angular/core';
import { SartographyWorkflowLibComponent } from './components/sartography-workflow-lib.component';
import {AppEnvironment} from './types/app-environment';

class DefaultEnvironment implements AppEnvironment {
  production = false;
  api = '';
  googleAnalyticsKey = '';
  irbUrl = '';
}

@NgModule({
  declarations: [SartographyWorkflowLibComponent],
  imports: [
  ],
  exports: [SartographyWorkflowLibComponent],
  providers: [{provide: 'APP_ENVIRONMENT', useClass: DefaultEnvironment}]
})
export class SartographyWorkflowLibModule { }
