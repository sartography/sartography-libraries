import {formatDate} from '@angular/common';
import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {Observable, of} from 'rxjs';
import {ApiService} from '../../../services/api.service';
import {map} from 'rxjs/operators';

interface SelectFieldOption {
  value: string;
  label: string;
}

@Component({
  selector: 'lib-form-printout',
  templateUrl: './form-printout.component.html',
  styleUrls: ['./form-printout.component.scss']
})
export class FormPrintoutComponent implements OnInit {
  @Input() field: FormlyFieldConfig;
  value: string = "";
  label: string = "";
  key: string = "";

  constructor(protected api: ApiService) {
  }

  ngOnInit(): void {
    this.key = this.field.key as string;
    this.getModelValue().subscribe(value=> {
      this.value = value;
    })
    this.label = this.addColon(this.field.templateOptions.label);
  }


  getModelValue(): Observable<string> {
    if(!(this.key in this.field.model)) {
      return of("");
    }
    let val = this.field.model[this.key];
    const fType = this.field.type;

    console.log("IT IS A ", fType)

    // If this is an autocomplete, or select field or radio field, get
    if(fType === 'autocomplete') {
      return this.getAutcompleteValue();
    }

    // If this is a radio or checkbox field, get the human-readable label for it
    if (fType === 'radio' || fType === 'select') {
      return this.getSelectValue();
    }

    if (fType === 'file') {
      return of(val.name);
    }

    if (fType === 'datepicker') {
      let displayDate = '';
      if (val) {
        displayDate = formatDate(val, 'mediumDate', 'en-us');
      }
      return of(displayDate);
    }

    // If the value is not human-readable, at least strip the key name off the front of it.
    const keyStartPattern = RegExp(`^${this.key}`);
    if (typeof val === 'string' && keyStartPattern.test(val)) {
      val = val.replace(keyStartPattern, '');
    }

   // return all other values
    return of(val);
  }


  getAutcompleteValue(): Observable<string> {
    const fileParams = {
      study_id: this.field.templateOptions.study_id,
      workflow_id: this.field.templateOptions.workflow_id,
      task_spec_name: this.field.templateOptions.task_spec_name,
      form_field_key: this.field.key as string,
    };
    return this.api.lookupFieldOptions('', fileParams, this.field.model[this.key], 1).pipe(
      map(results => {
        if (results.length > 0) {
          return results[0][this.field.templateOptions.label_column] as string
        } else {
          return "I don't know what is going on."
        }
      })
    )
  }

  getSelectValue(): Observable<string> {
    const labels = [];
    const opts = this.field.templateOptions.options as SelectFieldOption[];
    let val = this.field.model[this.key];
    opts.forEach(o => {
        if (
          o.value === val || (Array.isArray(val) && val.includes(o.value)) ||
          (
            !!val &&
            typeof val === 'object' &&
            Object.getPrototypeOf(val) === Object.getPrototypeOf({}) &&
            val.hasOwnProperty(o.value) &&
            val[o.value] === true
          )
        ) {
          labels.push(o.label);
        }
    });

    if (labels.length > 0) {
      return of(labels.join(', '));
    } else {
      return of("")
    }
  }


  addColon(label: string) {
    if (!label) {
      return "";
    }
    if (label[label.length - 1] === ':' || label.trim().length === 0) {
      return label;
    } else {
      return label + ':';
    }
  }
}
