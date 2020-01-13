import { TestBed } from '@angular/core/testing';

import { SartographyWorkflowLibService } from './sartography-workflow-lib.service';

describe('SartographyWorkflowLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SartographyWorkflowLibService = TestBed.get(SartographyWorkflowLibService);
    expect(service).toBeTruthy();
  });
});
