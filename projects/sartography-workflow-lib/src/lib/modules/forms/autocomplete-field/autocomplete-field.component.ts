import {Component, OnInit, ViewChild} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInput} from '@angular/material/input';
import {FieldType} from '@ngx-formly/material';
import {Observable} from 'rxjs';
import {startWith, switchMap} from 'rxjs/operators';
import {ApiService} from '../../../services/api.service';
import {FileParams} from '../../../types/file';
import {FormControl} from '@angular/forms';
import {MatAutocompleteActivatedEvent, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
  selector: 'lib-autocomplete-field',
  templateUrl: './autocomplete-field.component.html',
  styleUrls: ['./autocomplete-field.component.scss']
})
export class AutocompleteFieldComponent extends FieldType implements OnInit {
  filter: Observable<Object[]>;
  label: string;

  fileParams: FileParams;

  textInputControl = new FormControl('');

  constructor(
    protected api: ApiService,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();


    this.fileParams = {
      study_id: this.to.study_id,
      workflow_id: this.to.workflow_id,
      task_spec_name: this.to.task_spec_name,
      form_field_key: this.key as string,
    };

    if(this.value) {
      console.log("Pre-loading Value!", this.value);
      this.setSelectionFromValue(this.value);
    }

    if (this.to.filter) {
      this.filter = this.textInputControl.valueChanges.pipe<string, Object[]>(
        startWith(''),
        switchMap<string, Observable<Object[]>>(term => {
          this.value = "invalid";
          return this.to.filter(term);
        }));
    }
  }


  setSelectionFromValue(value: string) {
    this.api.lookupFieldOptions('', this.fileParams, this.value, 1).subscribe(hits => {
      if(hits.length > 0) {
        this.label = hits[0][this.to.label_attribute];
      } else {
        console.error("Failed to locate previous selection for auto-complete, leaving blank.")
      }
    })
  }

  newSelection(selected: MatAutocompleteSelectedEvent) {
    console.log("New Selection!", selected.option.value);
    const selected_object = selected.option.value;
    this.value = selected_object[this.to.value_attribute]
    console.log("Value now set to ", this.value);
  }

  displayFn(lookupData: Object): string {
    if (!lookupData) {
      return ""
    } else if (typeof lookupData === 'string') {
      return lookupData
    } else if ('label_attribute' in this.to) {
      return lookupData[this.to.label_attribute];
    } else {
      return JSON.stringify(lookupData)
    }
  }
}
