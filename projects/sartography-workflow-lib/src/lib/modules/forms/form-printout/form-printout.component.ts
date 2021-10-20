import {formatDate} from '@angular/common';
import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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
export class FormPrintoutComponent implements OnInit, OnChanges {
  @Input() field: FormlyFieldConfig;
  @Input() model: object;  // model will get correctly updated onChanges, field does not.

  value: string = "";
  label: string = "";
  key: string = "";

  constructor(protected api: ApiService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.model = changes['model'].currentValue;
    this.updateValue();
    this.label = this.addColon(this.field.templateOptions.label);
  }

  ngOnInit(): void {
    this.updateValue();
    this.label = this.addColon(this.field.templateOptions.label);
  }

  updateValue() {

    this.key = this.field.key as string;
    if(!(this.key in this.model)) {
      this.value = "";
      return ""
    }

    let val = this.model[this.key];
    const fType = this.field.type;

    switch (fType) {
      case('autocomplete'):
        this.getAutcompleteValue().subscribe( val => this.value = val)
        break;
      case('radio'):
      case('select'):
        this.value = this.getSelectValue();
        break;
      case('file'):
        if(val && 'name' in val) {
          this.value = val.name;
        }
        break;
      case('datepicker'):
        if (val) {
          this.value = formatDate(val, 'mediumDate', 'en-us');
        }
        break;
      default:
        this.value = val;
    }
  }


  getAutcompleteValue(): Observable<string> {
    const fileParams = {
      study_id: this.field.templateOptions.study_id,
      workflow_id: this.field.templateOptions.workflow_id,
      task_spec_name: this.field.templateOptions.task_spec_name,
      form_field_key: this.field.key as string,
    };
    return this.api.lookupFieldOptions('', fileParams, this.model[this.key], 1).pipe(
      map(results => {
        if (results.length > 0) {
          return results[0][this.field.templateOptions.label_column] as string
        } else {
          return "I don't know what is going on."
        }
      })
    )
  }

  getSelectValue(): string {
    const labels = [];
    const opts = this.field.templateOptions.options as SelectFieldOption[];
    let val = this.model[this.key];
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
      return labels.join(', ');
    } else {
      return "";
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
