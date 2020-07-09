/**
 * Utility functions for creating a Formly component for testing, based on:
 * https://github.com/ngx-formly/ngx-formly/tree/main/src/core/testing/src
 *
 * This and other useful testing tools will be included in Formly v6, so
 * this file can be deleted once v6 is released in the 2nd half of 2020:
 * https://github.com/ngx-formly/ngx-formly/milestone/6
 */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement, APP_INITIALIZER, NgModule } from '@angular/core';
import { FormlyModule, FormlyFormBuilder, FormlyFieldConfig, ConfigOption } from '@ngx-formly/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

function setInputs<T>(fixture: ComponentFixture<T>, inputs: T, detectChanges = true) {
  Object.keys(inputs).forEach((input) => {
    fixture.componentInstance[input] = inputs[input];
  });

  if (detectChanges !== false) {
    fixture.detectChanges();
  }
}

export interface IFormlyDebugElement<E> extends DebugElement {
  readonly nativeElement: E;
}

export interface IComponentOptions<T> extends NgModule {
  template?: string;
  inputs?: T;
  config?: ConfigOption;
  detectChanges?: boolean;
}

export function createComponent<T>({
  template,
  inputs,
  config,
  detectChanges,
  imports,
  declarations,
  providers,
}: IComponentOptions<T>) {
  TestBed.configureTestingModule({
    declarations: [FormlyTestComponent, ...(declarations || [])],
    imports: [ReactiveFormsModule, FormlyModule.forRoot(config), ...(imports || [])],
    providers: providers || [],
  }).overrideComponent(FormlyTestComponent, {
    set: {
      template,
      inputs: Object.keys(inputs),
    },
  });

  const fixture = TestBed.createComponent(FormlyTestComponent);
  Object.keys(inputs).forEach((input) => {
    fixture.componentInstance[input] = inputs[input];
  });

  setInputs(fixture, inputs, detectChanges);

  type FixtureUtils = T & {
    fixture: ComponentFixture<T>;
    detectChanges: typeof fixture['detectChanges'];
    setInputs: (inputs: Partial<T>) => void;
    query: <E extends Element = Element>(selector: string) => IFormlyDebugElement<E>;
    queryAll: <E extends Element = Element>(selector: string) => IFormlyDebugElement<E>[];
  };

  const utils = {
    fixture,
    detectChanges: () => fixture.detectChanges(),
    setInputs: (props) => setInputs(fixture, props),
    query: (selector: string) => fixture.debugElement.query(By.css(selector)),
    queryAll: (selector: string) => fixture.debugElement.queryAll(By.css(selector)),
  } as FixtureUtils;

  Object.keys(inputs).forEach((input) => {
    Object.defineProperty(utils, input, {
      get: () => fixture.componentInstance[input],
    });
  });

  return utils;
}

export function createFormlyFieldComponent(
  field: FormlyFieldConfig,
  config: IComponentOptions<{ field: FormlyFieldConfig }> = {},
) {
  const model = field && field.model ? field.model : {};
  if (field && field.model) {
    delete (field as any).model;
  }
  const options = field && field.options ? field.options : {};
  if (field && field.options) {
    delete (field as any).options;
  }
  return createComponent<{ field: FormlyFieldConfig }>({
    template: '<formly-field [field]="field"></formly-field>',
    inputs: { field },
    ...config,
    providers: [
      ...(config.providers || []),
      {
        provide: APP_INITIALIZER,
        useFactory: (builder: FormlyFormBuilder) => () => {
          const testControl = new FormControl();
          builder.buildForm(
            new FormGroup({test: testControl}),
            [field],
            model,
            options
          );

          return of(null);
        },
        deps: [FormlyFormBuilder],
        multi: true,
      },
    ],
  });
}

@Component({
  selector: 'lib-formly-test-component',
  template: '',
})
export class FormlyTestComponent {}
