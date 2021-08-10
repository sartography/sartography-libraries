import {Directive, HostListener} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';


/** Enables file fields to be triggered by change events */
@Directive({
  selector: '[libFileValueAccessor], input[type=file]',
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: FileValueAccessorDirective, multi: true},
  ],
})
export class FileValueAccessorDirective implements ControlValueAccessor {
  value: any;

  @HostListener('change', ['$event.target.files'])
  onChange = (files: File[]) => {
  }

  @HostListener('blur', [])
  onTouched = () => {
  }

  writeValue(value) {
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
