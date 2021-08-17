import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RepeatSectionConfirmDialogComponent } from './repeat-section-confirm-dialog.component';


describe('RepeatSectionConfirmDialogComponent', () => {
  let component: RepeatSectionConfirmDialogComponent;
  let fixture: ComponentFixture<RepeatSectionConfirmDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RepeatSectionConfirmDialogComponent ],
      imports : [MatDialogModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {
            }
          }
        },
        {provide: MAT_DIALOG_DATA, useValue: {
            confirm: false,
          }},
      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatSectionConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should confirm deletion on submit', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    component.onConfirm();
    expect(closeSpy).toHaveBeenCalledWith(true);
  });

  it('should not change data on cancel', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    component.onDismiss();
    expect(closeSpy).toHaveBeenCalledWith(false);
  });
});
