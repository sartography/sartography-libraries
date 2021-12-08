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
     // Are we in a repeat? If so:
     if (this.field.type == 'repeat') {
       for (let x = 0; x < this.field.fieldArray.fieldGroup.length; x++) {
      if (typeof (this.field.fieldArray.fieldGroup[0].hideExpression) === 'function') {
        if ((this.field.fieldArray.fieldGroup[0].hideExpression(this.field.parent && this.field.parent.model, this.formState, this.field)) !== true) {
          console.log('weird thing - show group');
          return false;
        }
      }
    }
    // If everything in the group is hidden, hide the entire group.
    console.log('Hiding Repeat');
     return true;
     }

     // If nothing is in the fieldGroup (i.e. a new repeat section), don't hide the group.
     if (this.field.fieldGroup.length == 0) {
       console.log('group is empty; show it');
       return false;
     }
     // If anything in the field group is visible, don't hide the group.
     if (this.field.fieldGroup) {
       for (let x = 0; x < this.field.fieldGroup.length; x++) {
         if (this.field.fieldGroup[x].hide !== true ) {
           console.log('somethin is visible; show it');
           console.log('FG',this.field.fieldGroup);
           return false;
         }
       }
     }
     // If everything in the group is hidden, hide the entire group.
     console.log('hide the group');
     return true;
   }
}
