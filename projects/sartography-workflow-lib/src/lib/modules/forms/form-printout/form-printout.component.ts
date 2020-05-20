import {formatDate} from '@angular/common';
import {Component, Input} from '@angular/core';
import {FormlyFieldConfig} from '@ngx-formly/core';

interface SelectFieldOption {
  value: string;
  label: string;
}

@Component({
  selector: 'lib-form-printout',
  templateUrl: './form-printout.component.html',
  styleUrls: ['./form-printout.component.scss']
})
export class FormPrintoutComponent {
  @Input() field: FormlyFieldConfig;

  constructor() {
  }

  getModelValue(key: string) {
    let val = this.field.model[key];

    // If this is a select field, get the human-readable label for it
    if (this.field.fieldGroup) {
      let selectLabel: string;
      this.field.fieldGroup.forEach(f => {
        if (['select', 'multicheckbox', 'radio'].includes(f.type)) {
          const opts = f.templateOptions.options as SelectFieldOption[];
          opts.forEach(o => {
            if (!this._isOther(o.value) && !this._isOther(o.label)) {
              if (
                o.value === val ||
                (
                  !!val &&
                  typeof val === 'object' &&
                  Object.getPrototypeOf(val) === Object.getPrototypeOf({}) &&
                  val.hasOwnProperty(o.value) &&
                  val[o.value] === true
                )
              ) {
                selectLabel = selectLabel === undefined ? o.label : selectLabel + ', ' + o.label;
              }
            }
          });
        }
      });

      if (selectLabel) {
        return selectLabel;
      }
    }

    if (this.field.type === 'datepicker') {
      return formatDate(val, 'mediumDate', 'en-us');
    }

    // If the value is not human-readable, at least strip the key name off the front of it.
    const keyStartPattern = RegExp(`^${key}`);
    if (typeof val === 'string' && keyStartPattern.test(val)) {
      val = val.replace(keyStartPattern, '');
    }

    // If it's the "other" value, make sure "other" is selected in its parent field before displaying it.
    const otherPattern = /_other$|\w+Other$/;
    const keyEndsWithOther = otherPattern.test(key);
    if (keyEndsWithOther) {
      const parentKey = key.replace(otherPattern, '');
      const parentVal = this.field.model[parentKey];
      return this._isOther(parentVal) || otherPattern.test(parentVal) ? val : null;
    } else {

      // It's a human-readable value. Just return it now, unless the value is "Other".
      return this._isOther(val) ? null : val;
    }
  }

  private _isOther(value: string): boolean {
    return value && typeof value === 'string' && value.toLowerCase() === 'other';
  }

}
