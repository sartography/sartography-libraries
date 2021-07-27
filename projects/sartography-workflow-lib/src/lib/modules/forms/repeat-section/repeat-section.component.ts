import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FieldArrayType, FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import * as createClone from 'rfdc';
import {RepeatSectionDialogData} from '../../../types/repeat-section-dialog-data';
import {RepeatSectionDialogComponent} from '../repeat-section-dialog/repeat-section-dialog.component';
import {ApiService} from '../../../services/api.service';

@Component({
  selector: 'lib-repeat-section',
  templateUrl: './repeat-section.component.html',
  styleUrls: ['./repeat-section.component.scss']
})
export class RepeatSectionComponent extends FieldArrayType implements OnInit {
  constructor(
    public dialog: MatDialog,
    protected api: ApiService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  openDialog(i: number, f?: FormlyFieldConfig) {
    const isEdit = !!f;
    const title = this.field.templateOptions.label || 'Add ' + this.field.templateOptions.buttonLabel;
    const options: FormlyFormOptions = {
        formState: {
          mainModel: this.field.parent.model,
        },
      };
    const dialogData: RepeatSectionDialogData = {
      title: isEdit ? title.replace(/^Add an|^Add a|^Add/, 'Edit') : title,
      fields: [createClone()(this.field.fieldArray)],
      model: isEdit ? this.field.fieldGroup[i].model : {},
      options
    };
    const cachedData: RepeatSectionDialogData = createClone({circles: true})(dialogData);
    const dialogRef = this.dialog.open(RepeatSectionDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      minWidth: '70vw',
      data: cachedData,
    });

    dialogRef.afterClosed().subscribe((model: any) => {
      console.log('Repeat Section Form State:', this.formState);
      if (model) {
        if (this.field.fieldGroup.length > i) {
          super.remove(i);
        }

        super.add(i, model);
      }
    });
  }

  remove(i: number) {
    for (const field of this.field.fieldGroup[i].fieldGroup) {
      const fieldKey = field.key as string;
      if (field.type === 'file' && fieldKey in this.model[i]) {
        this.removeFile(this.model[i][fieldKey].id);
      }
    }
    super.remove(i);
  }

  removeFile(fileId) {
    this.api.deleteFileMeta(fileId).subscribe();
  }

  shouldHide(): boolean {
    if (
      this.field &&
      this.field.hideExpression &&
      typeof (this.field.hideExpression) === 'function'
    ) {
      return !!(this.field.hideExpression(this.field.parent && this.field.parent.model, this.formState, this.field));
    } else {
      return false;
    }
  }
}
