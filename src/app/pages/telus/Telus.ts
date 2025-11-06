import { Component, effect, inject, Injectable, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TelusService } from './services/Telus.service';
import { Observable } from 'rxjs';
import { HttpResponses } from './models/HttpResponses';
import { error } from 'node:console';

@Component({
  selector: 'telus-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './Telus.html',
  styleUrl: './Telus.css',
})
@Injectable({ providedIn: 'root' })
export class Telus {
  private service = inject(TelusService);
  events: Array<HttpResponses.event> = [];
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
        value => this.events.push(...value),
        error => console.error(error),
        () => console.log("Retrieved")
      );
    });
  }

  creatWorkEvent() {
    this.service.createWorkEvent(new Date());
  }
}
