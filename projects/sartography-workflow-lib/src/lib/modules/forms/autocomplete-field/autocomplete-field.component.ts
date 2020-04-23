import {Component, OnInit, ViewChild} from '@angular/core';
import {MatInput} from '@angular/material/input';
import {FieldType} from '@ngx-formly/material';
import {Observable} from 'rxjs';
import {startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'lib-autocomplete-field',
  templateUrl: './autocomplete-field.component.html',
  styleUrls: ['./autocomplete-field.component.scss']
})
export class AutocompleteFieldComponent extends FieldType implements OnInit {
  @ViewChild(MatInput) formFieldControl: MatInput;
  filter: Observable<any>;

  ngOnInit(): void {
    super.ngOnInit();

    if (this.to.filter) {
      this.filter = this.formControl.valueChanges.pipe(
        startWith(''),
        switchMap(term => this.to.filter(term)),
      );
    }
  }

}
