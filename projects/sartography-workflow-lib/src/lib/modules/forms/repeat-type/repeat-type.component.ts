import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FieldArrayType, FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { ApiService } from '../../../services/api.service';
import { RepeatSectionConfirmDialogComponent } from '../repeat-section-confirm-dialog/repeat-section-confirm-dialog.component';

@Component({
  selector: 'lib-repeat-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './repeat-type.component.html',
  styleUrls: ['./repeat-type.component.scss'],
})
export class RepeatTypeComponent extends FieldArrayType {
  constructor(
    public dialog: MatDialog,
    protected api: ApiService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
  }

  confirmDelete(i: number, f?: FormlyFieldConfig) {
    const dialogRef = this.dialog.open(RepeatSectionConfirmDialogComponent, {
      width: '33vw',
      maxWidth: '100vw',
      maxHeight: '100vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.remove(i)
        this.changeDetector.detectChanges()
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

}
