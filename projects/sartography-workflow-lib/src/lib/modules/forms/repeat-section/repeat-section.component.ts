import {Component, OnInit} from '@angular/core';
import {FieldArrayType, FormlyFieldConfig} from '@ngx-formly/core';
import {MatDialog} from '@angular/material/dialog';
import {RepeatSectionDialogComponent} from '../repeat-section-dialog/repeat-section-dialog.component';
import createClone from 'rfdc';

@Component({
  selector: 'lib-repeat-section',
  templateUrl: './repeat-section.component.html',
  styleUrls: ['./repeat-section.component.scss']
})
export class RepeatSectionComponent extends FieldArrayType implements OnInit {
  constructor(
    public dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
  }

  openDialog(i: number, f?: FormlyFieldConfig) {
    const isEdit = !!f;
    const title = this.field.templateOptions.description || 'Add ' + this.field.templateOptions.label;
    const dialogRef = this.dialog.open(RepeatSectionDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      minWidth: '70vw',
      data: {
        title: isEdit ? title.replace(/^Add an|^Add a|^Add/, 'Edit') : title,
        fields: [createClone()(this.field.fieldArray)],
        model: isEdit ? this.field.fieldGroup[i].model : {},
      }
    });

    dialogRef.afterClosed().subscribe((model: any) => {
      if (model) {
        if (this.field.fieldGroup.length > i) {
          super.remove(i);
        }

        super.add(i, model);
      }
    });
  }
}
