import {Component, OnInit} from '@angular/core';
import {FieldType} from '@ngx-formly/material';
import {EMPTY, Observable} from 'rxjs';
import {debounceTime, startWith, switchMap, tap} from 'rxjs/operators';
import {ApiService} from '../../../services/api.service';
import {FileParams} from '../../../types/file';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
  selector: 'lib-autocomplete-field',
  templateUrl: './autocomplete-field.component.html',
  styleUrls: ['./autocomplete-field.component.scss']
})
export class AutocompleteFieldComponent extends FieldType implements OnInit {
  filter: Observable<Object[]>;
  selectedObject: Object; // The full object returned by the api, when one is selected.
  label: string;
  loading = false;
  fileParams: FileParams;
  numResults = 0;

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

    this.filter = this.textInputControl.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      switchMap<string, Observable<Object[]>>(term => {
        if(term === this.selectedObject) {
          return EMPTY;  // Don't try to saerch for the selected object, only do this for strings.
        }
        this.value = "invalid";
        this.loading = true;
        return this.api.lookupFieldOptions(term, this.fileParams, null, this.to.limit);
      })
    );

    this.filter.subscribe(results => {
      this.loading = false;
      this.numResults = results.length;
      this.selectedObject = null;
    })
  }

  state() {
    if(this.loading) {
      return "loading";
    } else if (this.selectedObject) {
      return "selected"
    } else if (this.numResults === 0) {
      return "no_results"
    } else {
      return "results"
    }
  }

  setSelectionFromValue(value: string) {
    this.api.lookupFieldOptions('', this.fileParams, value, 1).subscribe(hits => {
      if(hits.length > 0) {
        this.selectedObject = hits[0]
        this.label = hits[0][this.to.label_column];
        this.value = value;
      } else {
        console.error("Failed to locate previous selection for auto-complete, leaving blank.")
      }
    })
  }

  newSelection(selected: MatAutocompleteSelectedEvent) {
    this.selectedObject = selected.option.value;
    this.value = this.selectedObject[this.to.value_column];
    console.log("Selected Object is ", this.selectedObject);
    console.log("Value is ", this.value);
  }

  displayFn(lookupData: Object): string {
    if (!lookupData) {
      return ""
    } else if (typeof lookupData === 'string') {
      return lookupData
    } else {
      return lookupData[this.to.label_column];
    }
  }
}
