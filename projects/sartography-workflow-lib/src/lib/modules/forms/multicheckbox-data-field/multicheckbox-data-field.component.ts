import {AfterViewInit, Component} from '@angular/core';
import {FormlyFieldMultiCheckbox} from '@ngx-formly/material/multicheckbox';
import isEqual from 'lodash.isequal';

@Component({
  selector: 'lib-multicheckbox-data-field',
  templateUrl: './multicheckbox-data-field.component.html',
  styleUrls: ['./multicheckbox-data-field.component.scss']
})
export class MulticheckboxDataFieldComponent extends FormlyFieldMultiCheckbox implements AfterViewInit {
  initialized = false;

  ngAfterViewInit() {
    super.ngAfterViewInit();

    // Sometimes we can initialize it here...
    this._initializeValue();

    // ... but, sometimes, we have to wait for the first state change.
    this.stateChanges.subscribe(sc => {
      this._initializeValue();
    });
  }

  onChange(changedVal: any, checked: boolean) {
    if (this.to.type !== 'array') {
      console.error(`MulticheckboxDataFieldComponent must have templateOptions.type set to 'array'`);
      return;
    }

    // formControl.value will equal [undefined] if no old value exists.
    const hasOldValue = this.formControl.value && this.formControl.value.length > 0 && !isEqual(this.formControl.value, [undefined]);
    const oldValueArray = hasOldValue ? this.formControl.value : [];
    const newValueDict = {};

    // Dedupe the values, in case wires got crossed somewhere
    for (const oldVal of oldValueArray) {
      if (oldVal && !newValueDict.hasOwnProperty(oldVal.value)) {
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

    let formVal = this.formControl.value || [];

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
      if(!this._is_iterable(formVal)) {
        formVal = [formVal]
      }
      for (const val of formVal) {
        if (
          val &&
          typeof val === 'object' &&
          val.hasOwnProperty('value') &&
          option.value.hasOwnProperty('value') &&
          val.value === option.value.value
        ) {
          return true;
        }
      }
    }

    return false;
  }

  private _is_iterable(obj) {
    // checks for null and undefined
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
  }


  private _initializeValue() {
    // Only do this the first time
    if (!this.initialized && isEqual(this.formControl.value, [undefined])) {
      const hasCurrentValue = this.model.hasOwnProperty(this.field.key) && !isEqual(this.model[this.field.key], [undefined]);
      const defaultValue = hasCurrentValue ? this.model[this.field.key] : this.field.defaultValue;
      this.formControl.patchValue(defaultValue);
      this.initialized = true;
    }
  }
}
