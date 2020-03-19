import {AfterViewInit, Component, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FieldWrapper} from '@ngx-formly/core';
import {HelpDialogComponent} from '../help-dialog/help-dialog.component';

@Component({
  selector: 'lib-help-wrapper',
  templateUrl: './help-wrapper.component.html',
  styleUrls: ['./help-wrapper.component.scss']
})
export class HelpWrapperComponent extends FieldWrapper implements AfterViewInit {
  @ViewChild('matSuffix', {static: true}) matSuffix: TemplateRef<any>;
  expanded = false;

  constructor(
    public dialog: MatDialog
  ) {
    super();
  }

  ngAfterViewInit() {
    if (this.matSuffix) {
      Promise.resolve().then(() => {
        this.to.suffix = this.matSuffix;
      });
    }
  }

  openDialog($event: MouseEvent, title: string, text: string) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dialog.open(HelpDialogComponent, {
      width: '600px',
      data: {title, text}
    });
  }
}
