import {CommonModule} from '@angular/common';
import {Injectable, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
import {NgxFileDropModule} from 'ngx-file-drop';
import {MarkdownModule} from 'ngx-markdown';
import {SartographyPipesModule} from '../pipes/sartography-pipes.module';
import {FileBaseComponent} from './file-base/file-base.component';
import {FileFieldComponent} from './file-field/file-field.component';
import {FileUploadComponent} from './file-upload/file-upload.component';
import {FileValueAccessorDirective} from './file-upload/file-value-accessor.directive';
import {FormPrintoutComponent} from './form-printout/form-printout.component';
import {HelpDialogComponent} from './help-dialog/help-dialog.component';
import {HelpWrapperComponent} from './help-wrapper/help-wrapper.component';
import {helpWrapperExtension} from './help-wrapper/help-wrapper.extension';
import {MarkdownDescriptionWrapperComponent} from './markdown-description-wrapper/markdown-description-wrapper.component';
import {markdownDescriptionWrapperExtension} from './markdown-description-wrapper/markdown-description-wrapper.extension';
import {PanelWrapperComponent} from './panel-wrapper/panel-wrapper.component';
import {RepeatSectionDialogComponent} from './repeat-section-dialog/repeat-section-dialog.component';
import {RepeatSectionComponent} from './repeat-section/repeat-section.component';
import {
  EmailValidator, EmailValidatorMessage, MaxValidationMessage, MinValidationMessage,
  MulticheckboxValidator, MulticheckboxValidatorMessage,
  PhoneValidator, PhoneValidatorMessage,
  ShowError,
  UrlValidator, UrlValidatorMessage
} from './validators/formly.validator';


@Injectable()
export class AppFormlyConfig {
  public static config = {
    extras: {
      showError: ShowError,
    },
    types: [
      {name: 'file', component: FileFieldComponent, wrappers: ['form-field']},
      {name: 'files', component: FileUploadComponent, wrappers: ['form-field']},
      {name: 'repeat', component: RepeatSectionComponent},
    ],
    validators: [
      {name: 'phone', validation: PhoneValidator},
      {name: 'email', validation: EmailValidator},
      {name: 'url', validation: UrlValidator},
      {name: 'multicheckbox', validation: MulticheckboxValidator},
    ],
    validationMessages: [
      {name: 'phone', message: PhoneValidatorMessage},
      {name: 'email', message: EmailValidatorMessage},
      {name: 'url', message: UrlValidatorMessage},
      {name: 'multicheckbox', message: MulticheckboxValidatorMessage},
      {name: 'required', message: 'This field is required.'},
      {name: 'min', message: MinValidationMessage},
      {name: 'max', message: MaxValidationMessage},
    ],
    wrappers: [
      {name: 'panel', component: PanelWrapperComponent},
      {name: 'markdown_description', component: MarkdownDescriptionWrapperComponent},
      {name: 'help', component: HelpWrapperComponent},
    ],
    extensions: [
      {name: 'markdown_description', extension: {onPopulate: markdownDescriptionWrapperExtension}},
      {name: 'help', extension: {onPopulate: helpWrapperExtension}},
    ],
  };
}

@NgModule({
  declarations: [
    FileBaseComponent,
    FileFieldComponent,
    FileUploadComponent,
    FileValueAccessorDirective,
    FormPrintoutComponent,
    HelpDialogComponent,
    HelpWrapperComponent,
    MarkdownDescriptionWrapperComponent,
    PanelWrapperComponent,
    RepeatSectionComponent,
    RepeatSectionDialogComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormlyMatDatepickerModule,
    FormlyMaterialModule,
    FormlyModule.forRoot(AppFormlyConfig.config),
    FormlyModule.forRoot(AppFormlyConfig.config),
    FormsModule,
    MarkdownModule.forRoot(),
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    NgxFileDropModule,
    SartographyPipesModule,
  ],
  exports: [
    FileBaseComponent,
    FileFieldComponent,
    FileUploadComponent,
    FormPrintoutComponent,
    HelpDialogComponent,
    HelpWrapperComponent,
    MarkdownDescriptionWrapperComponent,
    PanelWrapperComponent,
    RepeatSectionComponent,
    RepeatSectionDialogComponent,
  ],
  providers: [],
  entryComponents: [
    HelpDialogComponent,
    RepeatSectionDialogComponent,
  ],
})
export class SartographyFormsModule {
}