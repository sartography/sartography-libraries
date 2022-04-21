import { TestBed } from '@angular/core/testing';

import { PiodideService } from './piodide.service';

describe('PiodideService', () => {
  let service: PiodideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PiodideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
