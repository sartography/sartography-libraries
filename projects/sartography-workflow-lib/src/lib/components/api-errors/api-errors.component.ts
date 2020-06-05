import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {ApiError} from '../../types/api';
import {snakeToSpace} from '../../util/string-clean';

export interface ApiErrorsBottomSheetData {
  apiErrors: ApiError[];
}

@Component({
  selector: 'lib-api-errors',
  templateUrl: './api-errors.component.html',
  styleUrls: ['./api-errors.component.scss']
})
export class ApiErrorsComponent implements OnInit {
  apiErrors: ApiError[];
  snakeToSpace = snakeToSpace;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ApiErrorsBottomSheetData,
    private _bottomSheetRef: MatBottomSheetRef<ApiErrorsComponent>
  ) {
    if (data && data.apiErrors && data.apiErrors.length > 0) {
      this.apiErrors = data.apiErrors;
    }
  }

  ngOnInit(): void {
  }

  dismiss(event: MouseEvent) {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
