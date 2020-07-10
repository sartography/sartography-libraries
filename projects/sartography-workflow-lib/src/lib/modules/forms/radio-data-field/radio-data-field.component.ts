import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatRadioChange} from '@angular/material/radio';
import {FormlyFieldRadio} from '@ngx-formly/material/radio';

@Component({
  selector: 'lib-radio-data-field',
  templateUrl: './radio-data-field.component.html',
  styleUrls: ['./radio-data-field.component.scss']
})
export class RadioDataFieldComponent extends FormlyFieldRadio implements OnInit, AfterViewInit {
  ngOnInit() {
    super.ngOnInit();
    // this.value = this.model[this.key];
    // this.formControl.patchValue(this.value);
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  getSelected() {
    const storedVal = this.model[this.key].value;

    if (this.radioGroup) {
      const radios = this.radioGroup._radios.toArray();

      for (const radio of radios) {
        if (radio.value.value === storedVal) {
          return radio;
        }
      }
    }

    return null;
  }

  selectRadio(e: MatRadioChange) {
    this.formControl.patchValue(e.value);
  }
}
