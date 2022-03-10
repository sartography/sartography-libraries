import {FormControl, ValidationErrors} from '@angular/forms';
import {FieldType, FormlyFieldConfig} from '@ngx-formly/core';
import isEqual from 'lodash.isequal';
import {isNumberDefined} from '../../../util/is-number-defined';
import EMAIL_REGEX from './email.regex';
import PHONE_REGEX from './phone.regex';
import URL_REGEX from './url.regex';

export function EmailValidator(control: FormControl): ValidationErrors {
  return !control.value || EMAIL_REGEX.test(control.value) ? null : {email: true};
}

export function EmailValidatorMessage(err, field: FormlyFieldConfig) {
  return `"${field.formControl.value}" is not a valid email address`;
}

export function UrlValidator(control: FormControl): ValidationErrors {
  return !control.value || URL_REGEX.test(control.value) ? null : {url: true};
}

export function UrlValidatorMessage(err, field: FormlyFieldConfig) {
  return `We cannot save "${field.formControl.value}". Please provide the full path, including http:// or https://`;
}

export function PhoneValidator(control: FormControl): ValidationErrors {
  return !control.value || PHONE_REGEX.test(control.value) ? null : {phone: true};
}

export function PhoneValidatorMessage(err, field: FormlyFieldConfig) {
  return `"${field.formControl.value}" is not a valid phone number`;
}

export function CheckedValidator(control: FormControl, field: FormlyFieldConfig): ValidationErrors {
  if (field.templateOptions.required) {
    return !control.value == true ? {checked: true} : null;
  } else {
    return null
  }
}

export function CheckedValidatorMessage() {
  return `You must check this box to continue.`;
}

export function MinValidationMessage(err, field) {
  return `This value should be more than ${field.templateOptions.min}`;
}

export function MaxValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.max}`;
}

export function ShowError(field: FieldType) {
  return field.formControl &&
    field.formControl.invalid &&
    (
      field.formControl.dirty ||
      (field.options && field.options.parentForm && field.options.parentForm.submitted) ||
      (field.field && field.field.validation && field.field.validation.show)
    );
}

export function NumberValidator(control: FormControl): ValidationErrors {
  const fields = (control as any)._fields;
  if (
    fields &&
    Array.isArray(fields) &&
    (fields.length > 0) &&
    fields[0].templateOptions.required &&
    !isNumberDefined(control.value)
  ) {
    return {required: true};
  }
  return !control.value || (typeof control.value === 'number') ? null : {number: true};
}

export function NumberValidatorMessage(err, field: FormlyFieldConfig) {
  return 'Please enter a number.';
}

export function AutocompleteValidator(control: FormControl): ValidationErrors {
  const fields = (control as any)._fields;
  const isRequired = (
    fields &&
    Array.isArray(fields) &&
    (fields.length > 0) &&
    fields[0].templateOptions.required
  );

  if (isRequired && !control.value) {
    return {required: true};
  }
  if (control.value === 'invalid') {
    return {autocomplete: true};
  }
}

export function AutocompleteValidatorMessage(err, field: FormlyFieldConfig) {
  return 'Not a valid selection. Please edit your entry and choose an option from the displayed list.';
}

export function FileFieldValidator(control: FormControl): ValidationErrors {
  const fields = (control as any)._fields;

  if (
    fields &&
    Array.isArray(fields) &&
    (fields.length > 0) &&
    fields[0].templateOptions.required &&
    !control.value
  ) {
    return {required: true};
  }
  return null;
}

export function FileFieldValidatorMessage(err, field: FormlyFieldConfig) {
  return 'Please upload a file.';
}

export function FileUploadValidator(control: FormControl): ValidationErrors {
  const fields = (control as any)._fields;

  if (
    fields &&
    Array.isArray(fields) &&
    (fields.length > 0) &&
    fields[0].templateOptions.required &&
    !control.value
  ) {
    return {required: true};
  }
  return null;
}

export function FileUploadValidatorMessage(err, field: FormlyFieldConfig) {
  return 'Please upload a file.';
}

export function RepeatSectionValidator(control: FormControl): ValidationErrors {
  const fields = (control as any)._fields;
  if (
    fields &&
    Array.isArray(fields) &&
    (fields.length > 0) &&
    fields[0].templateOptions.required &&
    [null, undefined].includes(control.value)
  ) {
    return {required: true};
  }
  return null;
}

export function RepeatSectionValidatorMessage(err, field: FormlyFieldConfig) {
  return 'Please add at least one.';
}

export function RegexValidator(control: FormControl, field: FormlyFieldConfig, options = {regex: ''}): ValidationErrors {
  return !control.value || RegExp(options.regex).test(control.value) ? null : {regex: true};
}

export function RegexValidatorMessage(err, field: FormlyFieldConfig) {
  return 'The given input is not valid.';
}
