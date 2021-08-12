import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'lib-repeat-section-confirm-dialog',
  templateUrl: './repeat-section-confirm-dialog.component.html',
  styleUrls: ['./repeat-section-confirm-dialog.component.scss']
})
export class RepeatSectionConfirmDialogComponent{

  constructor(
    public dialogRef: MatDialogRef<RepeatSectionConfirmDialogComponent>
  ) { }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}
