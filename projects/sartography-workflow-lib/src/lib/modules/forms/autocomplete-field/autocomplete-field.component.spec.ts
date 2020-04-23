import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormlyConfig, FormlyFormBuilder, FormlyModule} from '@ngx-formly/core';
import {FormlyFieldConfigCache} from '@ngx-formly/core/lib/components/formly.field.config';
import {AutocompleteFieldComponent} from './autocomplete-field.component';

describe('AutocompleteFieldComponent', () => {
  let component: AutocompleteFieldComponent;
  let fixture: ComponentFixture<AutocompleteFieldComponent>;
  let builder: FormlyFormBuilder;
  let form: FormGroup;
  let field: FormlyFieldConfigCache;
  let config: FormlyConfig;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AutocompleteFieldComponent],
      imports: [
        BrowserAnimationsModule,
        FormlyModule.forRoot({
          types: [
            {name: 'autocomplete', component: AutocompleteFieldComponent, wrappers: ['form-field']},
          ],
        }),
        FormsModule,
        HttpClientTestingModule,
        MatAutocompleteModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(inject([FormlyFormBuilder, FormlyConfig], (formlyBuilder: FormlyFormBuilder, formlyConfig: FormlyConfig) => {
    form = new FormGroup({});
    config = formlyConfig;
    builder = formlyBuilder;
    field = {
      key: 'hi',
    };
    builder.buildForm(form, [field], {}, {});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteFieldComponent);
    component = fixture.componentInstance;
    component.field = field;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
