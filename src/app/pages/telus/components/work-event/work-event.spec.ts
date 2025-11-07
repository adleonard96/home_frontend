import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkEvent } from './work-event';

describe('WorkEvent', () => {
  let component: WorkEvent;
  let fixture: ComponentFixture<WorkEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
