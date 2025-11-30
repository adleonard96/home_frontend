import {
  Component,
  effect,
  EventEmitter,
  inject,
  Injectable,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TimeTrackingService } from './services/TimeTracking.service';
import { concatMap, map, Observable, of, scan } from 'rxjs';
import { HttpResponses } from './models/HttpResponses';
import { WorkEvent } from './components/work-event/work-event';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'timeTracking-root',
  imports: [RouterOutlet, RouterModule, WorkEvent, AsyncPipe],
  templateUrl: './TimeTracking.html',
  styleUrl: './TimeTracking.css',
})
@Injectable({ providedIn: 'root' })
export class TimeTracking {
  private service = inject(TimeTrackingService);
  @Output() updateComplete = new EventEmitter<void>();

  // events: Array<HttpResponses.event>;
  events: WritableSignal<HttpResponses.event[]> = signal([]);
  todaysEvents: WritableSignal<HttpResponses.event[]> = signal([]);
  hoursToday: WritableSignal<number> = signal(0);
  today = new Date();
  constructor() {
    effect(() => {
      let todayEpoch = Date.now();
      let daysFromSunday = this.today.getDay();
      const SATURDAY_NO = 6;
      let daysToSaturday = SATURDAY_NO - this.today.getDay();

      let DAY_IN_MS = 86_400_000;
      let sunday = new Date(todayEpoch - daysFromSunday * DAY_IN_MS);
      let saturday = new Date(todayEpoch + daysToSaturday * DAY_IN_MS);


    });
  }

  creatWorkEvent() {
    let res = this.service.createWorkEvent(new Date());

    res.subscribe((value) => {
      if (value) {
        this.events.set([value, ...this.events()]);
      }
    });
  }

  deleteWorkEvent(id: number) {
    this.events.set(this.events().filter((event) => event.id != id));
  }

  setWorkEvents(saturday: Date, sunday: Date) {
      this.service.getWorkEvents(sunday, saturday).subscribe(
        (value) => {
          if (value.length > 0) {
            this.events.set(
              value.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
            );
            this.todaysEvents.set(
              this.events().filter((event) => {
                let eventDate = new Date(event.start);
                return (
                  eventDate.getDate() == this.today.getDate() &&
                  eventDate.getMonth() == this.today.getMonth() &&
                  eventDate.getFullYear() == this.today.getFullYear() &&
                  event.stop !== undefined
                );
              })
            );
            this.hoursToday.set(
              this.todaysEvents().reduce((acc, event) => {
                let start = new Date(event.start).getTime();
                let end = event.stop ? new Date(event.stop).getTime() : Date.now();
                let durationInHours = (end - start) / (1000 * 60 * 60);
                return acc + durationInHours;
              }, 0)
            );
          }
        },
        (error) => console.error(error)
      );
  }

  brCheck = "";
  checkForBorder(dayOfWeek: string): boolean {
    if (this.brCheck === "") {
      this.brCheck = dayOfWeek;
      return true;
    } 
    
    let isTheSame = this.brCheck === dayOfWeek
    this.brCheck = dayOfWeek;
    return isTheSame;
  }
  // calcTimeForWeek() {
  //   let events = this.events().filter()
  // }
}
