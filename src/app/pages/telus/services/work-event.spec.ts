import { TestBed } from '@angular/core/testing';

import { WorkEvent } from './work-event.service';

describe('WorkEvent', () => {
  let service: WorkEvent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkEvent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
