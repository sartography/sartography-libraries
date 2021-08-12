import {Component, OnInit, ViewChild} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInput} from '@angular/material/input';
import {FieldType} from '@ngx-formly/material';
import {Observable} from 'rxjs';
import {startWith, switchMap} from 'rxjs/operators';
import {LookupData} from '../../../types/file';

@Component({
  selector: 'lib-autocomplete-field',
  templateUrl: './autocomplete-field.component.html',
  styleUrls: ['./autocomplete-field.component.scss']
})
export class AutocompleteFieldComponent extends FieldType implements OnInit {
  @ViewChild(MatInput) formFieldControl: MatInput;
  filter: Observable<LookupData[]>;

  ngOnInit(): void {
    super.ngOnInit();

    if (this.to.filter) {
      this.filter = this.formControl.valueChanges.pipe<string, LookupData[]>(
        startWith(''),
        switchMap<string, Observable<LookupData[]>>(term => this.to.filter(term)),
      );
    }
  }

  displayFn(lookupData: LookupData): string {
    return lookupData && lookupData.label ? lookupData.label : '';
  }
}
