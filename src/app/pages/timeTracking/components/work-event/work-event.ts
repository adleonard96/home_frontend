import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AsyncPipe, NgStyle } from '@angular/common';
import { TimeTrackingService } from '../../services/TimeTracking.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { TimeTracking } from '../../TimeTracking';
import { EditForm } from '../edit-form/edit-form';
import { Clipboard } from '@angular/cdk/clipboard';
import { EventList } from '../event-list/event-list';

@Component({
  selector: 'app-work-event',
  imports: [AsyncPipe, EditForm],
  templateUrl: './work-event.html',
  styleUrl: './work-event.css',
})
export class WorkEvent {
  @Input() dayOfWeek: string | undefined;
  @Input() id: number | undefined;
  @Input() start: string | undefined;
  @Input() stop: string | undefined;
  @Input() isTraining: boolean | undefined;
  @Input() trainingDescription: string | undefined;
  @Output() updateComplete = new EventEmitter<void>();
  
  editMode: boolean = false;
  
  private service = inject(TimeTrackingService);
  private master = inject(EventList);
  private stopSubject = new BehaviorSubject<string | undefined>(undefined);
  stop$?: Observable<string | undefined> = this.stopSubject.asObservable();
  
  constructor(private clipboard: Clipboard) {}
  
  ngOnInit() {
    if (this.stop) {
      this.stopSubject.next(this.stop);
    }
  }
  
  getColor() {
    if (this.isTraining) {
      return "red"
    } else {
      return "#92AFD7"
    }
  }

  updateEdit() {
    this.editMode = true;
  }

  resumeEvent(id: number) {
    this.service.resumeEvent(id).subscribe({
      error: (err) => console.error(err),
    });
    this.stopSubject.next(undefined);
    this.master.startStopWorkEvent(id, undefined);
    this.updateComplete.emit();
  }

  closeEdit() {
    this.editMode = false;
  }

  editEvent(start: string, stop: string, dayOfWeek: string) {
    this.start = start;
    this.stopSubject.next(stop);
    this.dayOfWeek = dayOfWeek;
    this.updateComplete.emit();
  }

  stopEvent(id: number) {
    this.service
      .stopWorkEvent(id)
      .pipe(map((res) => res.stop))
      .subscribe({
        next: (stopValue) => {
          this.stopSubject.next(stopValue);
          if (stopValue) {
            this.master.startStopWorkEvent(id, stopValue);
          }
          this.updateComplete.emit();
        },
        error: (err) => console.error(err),
      });
  }

  deleteEvent(id: number) {
    this.service.deleteWorkEvent(id).subscribe({
      complete: () => {
        this.master.deleteWorkEvent(id);
      },
    });
  }

  updateEvent(start: string, stop: string, dayOfWeek: string, isTraining: boolean, trainingDescription: string) {
    this.start = start;
    this.stop = stop;
    this.dayOfWeek = dayOfWeek;
    this.isTraining = isTraining;
    this.trainingDescription = trainingDescription;
  }

  copy(value: any) {
    this.clipboard.copy(value);
  }
}
