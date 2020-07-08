import { Component, OnInit } from '@angular/core';
import {FormlyFieldMultiCheckbox} from '@ngx-formly/material/multicheckbox';

@Component({
  selector: 'lib-multicheckbox-data-field',
  templateUrl: './multicheckbox-data-field.component.html',
  styleUrls: ['./multicheckbox-data-field.component.scss']
})
export class MulticheckboxDataFieldComponent extends FormlyFieldMultiCheckbox {
  isChecked(option: any) {
    const valArray = this.formControl.value;

    if (valArray) {
      for (const val of valArray) {
        if (Object.is(val, option.value)) {
          return true;
        }
      }
    }

    return false;
  }
}
