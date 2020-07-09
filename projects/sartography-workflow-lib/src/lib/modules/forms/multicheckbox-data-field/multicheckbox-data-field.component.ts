import {Component} from '@angular/core';
import {FormlyFieldMultiCheckbox} from '@ngx-formly/material/multicheckbox';

@Component({
  selector: 'lib-multicheckbox-data-field',
  templateUrl: './multicheckbox-data-field.component.html',
  styleUrls: ['./multicheckbox-data-field.component.scss']
})
export class MulticheckboxDataFieldComponent extends FormlyFieldMultiCheckbox {
  onChange(changedVal: any, checked: boolean) {
    if (this.to.type !== 'array') {
      console.error(`MulticheckboxDataFieldComponent must have templateOptions.type set to 'array'`);
      return;
    }

    const oldValueArray = this.formControl.value || [];
    const newValueDict = {};

    // Dedupe the values, in case wires got crossed somewhere
    for (const oldVal of oldValueArray) {
      if (!newValueDict.hasOwnProperty(oldVal.value)) {
        newValueDict[oldVal.value] = oldVal;
      }
    }

    if (checked) {
      // Add the new value if checked
      newValueDict[changedVal.value] = changedVal;
    } else {
      // Remove it if unchecked
      delete newValueDict[changedVal.value];
    }

    this.formControl.patchValue(Object.values(newValueDict));
    this.formControl.markAsTouched();
  }

  isChecked(option: any) {
    if (this.to.type !== 'array') {
      console.error(`MulticheckboxDataFieldComponent must have templateOptions.type set to 'array'`);
      return;
    }

    const formVal = this.formControl.value || [];

    if (option && formVal) {
      // Form value should be stored as an array like:
      // [
      //   {
      //     value: 'option_value_1',
      //     label: 'Option Value 1',
      //     data: { ... },
      //   },
      //   ...
      // ]
      for (const val of formVal) {
        if (val.hasOwnProperty('value') && option.value.hasOwnProperty('value') && val.value === option.value.value) {
          return true;
        }
      }
    }

    return false;
  }
}
