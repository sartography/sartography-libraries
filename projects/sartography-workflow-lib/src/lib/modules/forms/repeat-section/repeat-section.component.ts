import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FieldArrayType, FormlyFieldConfig} from '@ngx-formly/core';
import createClone from 'rfdc';
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
    const dialogData: RepeatSectionDialogData = {
      title: isEdit ? title.replace(/^Add an|^Add a|^Add/, 'Edit') : title,
      fields: [createClone()(this.field.fieldArray)],
      model: isEdit ? this.field.fieldGroup[i].model : {},
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
    for(const field of this.field.fieldGroup[i].fieldGroup) {
      if (field.type === 'file' && field.key in this.model[i]) {
        this.removeFile(this.model[i][field.key].id)
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
