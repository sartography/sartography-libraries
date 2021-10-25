import {CommonModule} from '@angular/common';
import {Injectable, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatTableModule} from '@angular/material/table';
import {FormlyModule} from '@ngx-formly/core';
import {FormlySelectModule} from '@ngx-formly/core/select';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
import {TruncateModule} from '@yellowspot/ng-truncate';
import {NgxFileDropModule} from 'ngx-file-drop';
import {MarkdownModule} from 'ngx-markdown';
import {SartographyPipesModule} from '../pipes/sartography-pipes.module';
import {AutocompleteFieldComponent} from './autocomplete-field/autocomplete-field.component';
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
import {RadioDataFieldComponent} from './radio-data-field/radio-data-field.component';
import {RepeatSectionDialogComponent} from './repeat-section-dialog/repeat-section-dialog.component';
import {RepeatSectionComponent} from './repeat-section/repeat-section.component';
import {
  AutocompleteValidator,
  AutocompleteValidatorMessage,
  EmailValidator,
  EmailValidatorMessage,
  FileFieldValidator,
  FileFieldValidatorMessage,
  FileUploadValidator,
  FileUploadValidatorMessage,
  MaxValidationMessage,
  MinValidationMessage,
  NumberValidator,
  NumberValidatorMessage,
  PhoneValidator,
  PhoneValidatorMessage,
  RepeatSectionValidator,
  RepeatSectionValidatorMessage,
  ShowError,
  UrlValidator,
  UrlValidatorMessage
} from './validators/formly.validator';
import { RepeatSectionConfirmDialogComponent } from './repeat-section-confirm-dialog/repeat-section-confirm-dialog.component';
import {MatProgressSpinnerModule, MatSpinner} from '@angular/material/progress-spinner';


@Injectable()
export class AppFormlyConfig {
  public static config = {
    extras: {
      showError: ShowError,
    },
    types: [
      {name: 'autocomplete', component: AutocompleteFieldComponent, wrappers: ['form-field']},
      {name: 'file', component: FileFieldComponent, wrappers: ['form-field']},
      {name: 'files', component: FileUploadComponent, wrappers: ['form-field']},
      {name: 'radio_data', component: RadioDataFieldComponent, wrappers: ['form-field']},
      {name: 'repeat', component: RepeatSectionComponent},
    ],
    validators: [
      {name: 'phone', validation: PhoneValidator},
      {name: 'email', validation: EmailValidator},
      {name: 'url', validation: UrlValidator},
      {name: 'number', validation: NumberValidator},
      {name: 'autocomplete', validation: AutocompleteValidator},
      {name: 'file', validation: FileFieldValidator},
      {name: 'files', validation: FileUploadValidator},
      {name: 'repeat', validation: RepeatSectionValidator},
    ],
    validationMessages: [
      {name: 'phone', message: PhoneValidatorMessage},
      {name: 'email', message: EmailValidatorMessage},
      {name: 'url', message: UrlValidatorMessage},
      {name: 'number', message: NumberValidatorMessage},
      {name: 'autocomplete', message: AutocompleteValidatorMessage},
      {name: 'file', message: FileFieldValidatorMessage},
      {name: 'files', message: FileUploadValidatorMessage},
      {name: 'repeat', message: RepeatSectionValidatorMessage},
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
    AutocompleteFieldComponent,
    FileBaseComponent,
    FileFieldComponent,
    FileUploadComponent,
    FileValueAccessorDirective,
    FormPrintoutComponent,
    HelpDialogComponent,
    HelpWrapperComponent,
    MarkdownDescriptionWrapperComponent,
    PanelWrapperComponent,
    RadioDataFieldComponent,
    RepeatSectionComponent,
    RepeatSectionDialogComponent,
    RepeatSectionConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormlyMatDatepickerModule,
    FormlyMaterialModule,
    FormlyModule.forRoot(AppFormlyConfig.config),
    FormlySelectModule,
    FormsModule,
    MarkdownModule.forRoot(),
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatTableModule,
    MatProgressSpinnerModule,
    NgxFileDropModule,
    ReactiveFormsModule,
    SartographyPipesModule,
    TruncateModule,
  ],
  exports: [
    AutocompleteFieldComponent,
    FileBaseComponent,
    FileFieldComponent,
    FileUploadComponent,
    FormPrintoutComponent,
    HelpDialogComponent,
    HelpWrapperComponent,
    MarkdownDescriptionWrapperComponent,
    PanelWrapperComponent,
    RadioDataFieldComponent,
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
