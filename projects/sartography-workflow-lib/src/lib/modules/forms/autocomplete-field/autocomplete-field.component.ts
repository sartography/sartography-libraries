import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FieldType} from '@ngx-formly/material';
import {EMPTY, Observable} from 'rxjs';
import {debounceTime, startWith, switchMap, tap} from 'rxjs/operators';
import {ApiService} from '../../../services/api.service';
import {FileParams} from '../../../types/file';
import {UntypedFormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
  selector: 'lib-autocomplete-field',
  templateUrl: './autocomplete-field.component.html',
  styleUrls: ['./autocomplete-field.component.scss']
})
export class AutocompleteFieldComponent extends FieldType implements OnInit, AfterViewInit {
  filter: Observable<Object[]>;
  selectedObject: Object; // The full object returned by the api, when one is selected.
  label: string;
  loading = false;
  fileParams: FileParams;
  numResults = 0;

  textInputControl = new UntypedFormControl('');

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
      irb_doc_code: this.key as string,
    };

    this.filter = this.textInputControl.valueChanges.pipe(
      debounceTime(500),
      startWith(''), // Initially execute this with an empty string to get some results back.
      switchMap<string, Observable<Object[]>>(term => {
        if(term === this.selectedObject) {
          return EMPTY;  // Don't try to search for the selected object, only do this for strings.
        }
        if(term.length < 3) {
          term = "";  // Return all the results if we don't have a valid term yet ...
        }

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

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.setSelectionFromValue(this.value)
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

  valueChanged(newValue) {
    this.setSelectionFromValue(newValue)
  }

  setSelectionFromValue(value) {
    if(this.textInputControl.value == value || value == false || value == null) {
      return;
    }

    this.api.lookupFieldOptions('', this.fileParams, value, 1).subscribe(hits => {
      if(hits.length > 0) {
        this.selectedObject = hits[0]
        this.label = hits[0][this.to.label_column];
      } else {
        console.error("Failed to locate selection '" + value + "' for auto-complete, leaving blank.")
      }
    })
  }

  newSelection(selected: MatAutocompleteSelectedEvent) {
    this.selectedObject = selected.option.value;
    this.value = this.selectedObject[this.to.value_column];
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
