import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SartographyWorkflowLibComponent } from './sartography-workflow-lib.component';

describe('SartographyWorkflowLibComponent', () => {
  let component: SartographyWorkflowLibComponent;
  let fixture: ComponentFixture<SartographyWorkflowLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SartographyWorkflowLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SartographyWorkflowLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
