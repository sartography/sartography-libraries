import {TestBed} from '@angular/core/testing';

import {IntervalService} from './interval.service';

describe('IntervalService', () => {
  let service: IntervalService;
  let setIntervalSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IntervalService,
      ]
    });

    service = TestBed.inject(IntervalService);
    setIntervalSpy = spyOn(window, 'setInterval').and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.interval).toBeUndefined();
  });

  it('should set interval', () => {
    service.setInterval(() => {
    }, 0);
    expect(setIntervalSpy).toHaveBeenCalled();
    expect(service.interval).toBeDefined();
  });

  it('should clear interval', () => {
    service.setInterval(() => {
    }, 0);
    expect(setIntervalSpy).toHaveBeenCalled();
    expect(service.interval).toBeDefined();
    setIntervalSpy.calls.reset();

    service.clearInterval();
    expect(setIntervalSpy).not.toHaveBeenCalled();
    expect(service.interval).toBeUndefined();
  });
});
