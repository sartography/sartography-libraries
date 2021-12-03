import { Component, OnInit } from '@angular/core';
import {FieldWrapper} from '@ngx-formly/core';

@Component({
  selector: 'lib-panel-wrapper',
  templateUrl: './panel-wrapper.component.html',
  styleUrls: ['./panel-wrapper.component.scss']
})
export class PanelWrapperComponent extends FieldWrapper {

  // Loop through every field in group. If all are hidden, hide the group wrapper
   shouldHide(): boolean {
     if (this.field.fieldGroup) {
       for (let x = 0; x < this.field.fieldGroup.length; x++) {
         if (this.field.fieldGroup[x].hide == false) {
           return false;
         }
       }
     }
     return true;
   }
}
