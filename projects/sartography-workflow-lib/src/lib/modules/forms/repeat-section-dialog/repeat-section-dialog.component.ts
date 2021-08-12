import {AfterContentInit, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import * as cloneDeep from 'lodash/cloneDeep';
import {RepeatSectionDialogData} from '../../../types/repeat-section-dialog-data';
import {scrollToFirstInvalidField} from '../../../util/scroll-to-top';

@Component({
  selector: 'lib-repeat-section-dialog',
  templateUrl: './repeat-section-dialog.component.html',
  styleUrls: ['./repeat-section-dialog.component.scss']
})
export class RepeatSectionDialogComponent implements AfterContentInit {
  disableSave: boolean;
  initialModel: any;

  constructor(
    public dialogRef: MatDialogRef<RepeatSectionDialogComponent>,
    private deviceDetectorService: DeviceDetectorService,
    @Inject(MAT_DIALOG_DATA) public data: RepeatSectionDialogData
  ) {
  }

  ngAfterContentInit(): void {
    // Cache model in case user cancels
    this.initialModel = cloneDeep(this.data.model);
    this.updateDisableSave();
  }

  updateDisableSave() {
    this.disableSave = !this.noErrors();
  }

  noErrors(): boolean {
    return this.data.fields.every(f => f.formControl && f.formControl.valid);
  }

  onNoClick(): void {
    const isEmptyObject = Object.keys(this.initialModel).length === 0 && this.initialModel.constructor === Object;

    if (isEmptyObject) {
      this.dialogRef.close(undefined);
    } else {
      // Reset data model to initial state
      this.dialogRef.close(this.initialModel);
    }

  }

  highlightRequiredFields(fields: FormlyFieldConfig[]) {
    fields.forEach(f => {
      f.formControl.updateValueAndValidity();
      f.formControl.markAsDirty();

      if (f.fieldGroup) {
        this.highlightRequiredFields(f.fieldGroup);
      }
    });

    this.updateDisableSave();
  }

  nullOutHiddenFields(fields: FormlyFieldConfig[]) {
    fields.forEach(f => {
      console.log('Should I clear the data for this field?', f);
      if (f.hide) {
        this.data.model[f.key as string] = null;
      }
      if (f.fieldGroup) {
        this.nullOutHiddenFields(f.fieldGroup);
      }
    });
  }

  onInvalidFields(): void {
    this.highlightRequiredFields(this.data.fields);
    scrollToFirstInvalidField(this.deviceDetectorService);
  }

  onSubmit(): void {
    this.highlightRequiredFields(this.data.fields);
    this.nullOutHiddenFields(this.data.fields);

    if (this.noErrors()) {
      this.dialogRef.close(cloneDeep(this.data.model));
    } else {
      this.onInvalidFields();
    }
  }
}
