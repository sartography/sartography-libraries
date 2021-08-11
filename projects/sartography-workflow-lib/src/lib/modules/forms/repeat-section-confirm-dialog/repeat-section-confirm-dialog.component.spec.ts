import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatSectionConfirmDialogComponent } from './repeat-section-confirm-dialog.component';

describe('RepeatSectionConfirmDialogComponent', () => {
  let component: RepeatSectionConfirmDialogComponent;
  let fixture: ComponentFixture<RepeatSectionConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepeatSectionConfirmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatSectionConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
