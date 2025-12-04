import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Injectable,
  Output,
  Signal,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { TimeTrackingService } from '../../services/TimeTracking.service';
import { HttpResponses } from '../../models/HttpResponses';
import { WorkEvent } from '../work-event/work-event';

@Component({
  selector: 'app-event-list',
  imports: [WorkEvent],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export class EventList {
  private service = inject(TimeTrackingService);
  @Output() updateComplete = new EventEmitter<void>();
  SATURDAY_NO = 6 as const;
  DAY_IN_MS = 86_400_000 as const;

  // events: Array<HttpResponses.event>;
  events: WritableSignal<HttpResponses.event[]> = signal([]);
  todaysEvents: WritableSignal<HttpResponses.event[]> = signal([]);
  hoursToday: WritableSignal<number> = signal(0);
  today = new Date();
  daysFromSunday = this.today.getDay();
  daysToSaturday = this.SATURDAY_NO - this.today.getDay();
  todayEpoch = Date.now();
  sunday = new Date(this.todayEpoch - this.daysFromSunday * this.DAY_IN_MS);
  saturday = new Date(this.todayEpoch + this.daysToSaturday * this.DAY_IN_MS);

  constructor() {
    this.setWorkEvents(this.saturday, this.sunday);
    setInterval(() => {
      this.updateTodaysHours();
    }, 1000);
  }

groupedEvents: Signal<[string, HttpResponses.event[]][]> = computed(() => {
  const groups: Record<string, HttpResponses.event[]> = {};

  for (const e of this.events()) {
    if (!groups[e.dayOfWeek]) groups[e.dayOfWeek] = [];
    groups[e.dayOfWeek].push(e);
  }

  const dayOrder = ["Saturday","Friday","Thursday","Wednesday","Tuesday","Monday","Sunday"];

  return dayOrder
    .filter(day => groups[day])
    .map(day => [day, groups[day]] as [string, HttpResponses.event[]]); // <-- type assertion
});


  creatWorkEvent() {
    let res = this.service.createWorkEvent(new Date());

    res.subscribe((value) => {
      if (value) {
        let currentEvents = [value].concat(this.events());

        this.events.set(currentEvents);
        console.log(this.events);
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
          this.updateTodaysHours();
        } else {
          this.events.set([]);
          this.todaysEvents.set([]);
          this.hoursToday.set(0);
        }
      },
      (error) => console.error(error)
    );
  }

  updateTodaysHours() {
    this.hoursToday.set(
      this.todaysEvents().reduce((acc, event) => {
        let start = new Date(event.start).getTime();
        let end = event.stop ? new Date(event.stop).getTime() : Date.now();
        let durationInHours = (end - start) / (1000 * 60 * 60);
        return +`${acc + durationInHours}`.slice(0, 7);
      }, 0)
    );
  }

  changeWeek(timeDiffInDays: number) {
    this.sunday.setDate(this.sunday.getDate() + timeDiffInDays);
    this.saturday.setDate(this.saturday.getDate() + timeDiffInDays);
    this.setWorkEvents(this.saturday, this.sunday);
  }

  brCheck = '';
  checkForBorder(dayOfWeek: string): boolean {
    if (this.brCheck === '') {
      this.brCheck = dayOfWeek;
      return true;
    }

    let isTheSame = this.brCheck === dayOfWeek;
    this.brCheck = dayOfWeek;
    return isTheSame;
  }
}
