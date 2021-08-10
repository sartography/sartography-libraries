import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';

import { ApiErrorsComponent } from './api-errors.component';

describe('ApiErrorsComponent', () => {
  let component: ApiErrorsComponent;
  let fixture: ComponentFixture<ApiErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ApiErrorsComponent
      ],
      imports: [
        MatIconModule,
        MatListModule,
      ],
      providers: [
        {
          provide: MatBottomSheetRef,
          useValue: {
            dismiss: (dialogResult: any) => {
            }
          }
        },
        {provide: MAT_BOTTOM_SHEET_DATA, useValue: {apiErrors: [{
          status_code: 400,
          code: 'error_code',
          hint: 'You mother was a hampster.'
        }]}},
      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.data).toBeTruthy();
    expect(component.apiErrors).toBeTruthy();
  });

  it('should dismiss', () => {
    console.log("Component is ", component);
    const dismissSpy = spyOn((component as any).bottomSheetRef, 'dismiss').and.stub();
    component.dismiss(new MouseEvent('click'));
    expect(dismissSpy).toHaveBeenCalled();
  });

});
