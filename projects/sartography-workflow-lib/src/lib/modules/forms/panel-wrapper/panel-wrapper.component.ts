import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FieldWrapper} from '@ngx-formly/core';

@Component({
  selector: 'lib-panel-wrapper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './panel-wrapper.component.html',
  styleUrls: ['./panel-wrapper.component.scss']
})
export class PanelWrapperComponent extends FieldWrapper implements OnInit {
  hide: boolean;

  ngOnInit() {
    this.hide = this.shouldHide();
  }

  // Loop through every field in group. If all are hidden, hide the group wrapper
   shouldHide(): boolean {
     // Are we in a repeat? If so, evaluate the hide_expression applied to the repeat group:
     if (this.field.type == 'repeat' && this.field.fieldArray.fieldGroup) {
       // Loop through every field in this field group.
       for (let x = 0; x < this.field.fieldArray.fieldGroup.length; x++) {
         // If we can find a hide expression in the field group...
         let func = this.field.fieldArray.fieldGroup[x].hideExpression;
          if (typeof(func) === 'function') {
            // Determine if this field is hidden. If not, then show the whole group
            if ((func(this.field.parent && this.field.parent.model, this.formState, this.field)) !== true) {
            return false;
          }
            // is there even a hide expression in the fieldGroup? Then obviously don't hide it.
        } else  {
          return false;
          }
      }
    // If everything in the group is hidden, hide the entire group.
     return true;
     }

     // If nothing is in the fieldGroup, don't automatically hide the group.
     if (this.field.fieldGroup && this.field.fieldGroup.length == 0) {
       return false;
     }
     // If anything in the field group is visible, don't hide the group.
     if (this.field.fieldGroup) {
       for (let x = 0; x < this.field.fieldGroup.length; x++) {
         if (this.field.fieldGroup[x].hide !== true ) {
           return false;
         }
       }
     }
     // If everything in the group is hidden, hide the entire group.
     return true;
   }
}
