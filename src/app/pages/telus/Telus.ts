import { Component, effect, EventEmitter, inject, Injectable, Output, signal, WritableSignal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TelusService } from './services/Telus.service';
import { concatMap, map, Observable, of, scan } from 'rxjs';
import { HttpResponses } from './models/HttpResponses';
import { error } from 'node:console';
import { WorkEvent } from './components/work-event/work-event';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'telus-root',
  imports: [RouterOutlet, RouterModule, WorkEvent, AsyncPipe],
  templateUrl: './Telus.html',
  styleUrl: './Telus.css',
})
@Injectable({ providedIn: 'root' })
export class Telus {
  private service = inject(TelusService);
  @Output() updateComplete = new EventEmitter<void>();
    
  // events: Array<HttpResponses.event>;
  events: WritableSignal<HttpResponses.event[]> = signal([])
  constructor() {
    effect(() => {
      let todayEpoch = Date.now();
      let today = new Date();
      let daysFromSunday = today.getDay();
      const SATURDAY_NO = 6;
      let daysToSaturday = SATURDAY_NO - today.getDay();

      let DAY_IN_MS = 86_400_000;
      let sunday = new Date(todayEpoch - daysFromSunday * DAY_IN_MS);
      let saturday = new Date(todayEpoch + daysToSaturday * DAY_IN_MS);

      this.service.getWorkEvents(sunday, saturday).subscribe(
        value => {
          if (value.length > 0){
            this.events.set(value.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()))
          }
        },
        error => console.error(error)
      );
    });
  }

  creatWorkEvent() {
    let res = this.service.createWorkEvent(new Date());

    res.subscribe(
      value => {
        if (value) {
          this.events.set([value, ...this.events()])
        }
      }
    )
  }

  deleteWorkEvent(id: number) {
    this.events.set(this.events().filter(event => event.id != id));
  }
}
