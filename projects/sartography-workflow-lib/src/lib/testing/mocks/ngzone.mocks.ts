import {EventEmitter, Injectable, NgZone} from '@angular/core';

@Injectable()
export class MockNgZone extends NgZone {
  onStable: EventEmitter<any> = new EventEmitter(false);

  constructor() {
    super({enableLongStackTrace: false});
  }

  run(fn): any {
    return fn();
  }

  runOutsideAngular(fn): any {
    return fn();
  }

  simulateZoneExit(): void {
    this.onStable.emit(null);
  }
}
