import { Component, effect, inject, Injectable, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'telus-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './Telus.html',
  styleUrl: './Telus.css'
})

@Injectable({providedIn: 'root'})
export class Telus {
  private http = inject(HttpClient);
  private apiUrl = `http://192.168.1.21:8081/`

  constructor() {
    effect(() => {
      let todayEpoch = Date.now();
      let today = new Date();
      let daysFromSunday = today.getDay();
      const SATURDAY_NO = 6;
      let daysToSaturday = SATURDAY_NO - today.getDay();

      let DAY_IN_MS = 86_400_000
      let sunday = new Date(todayEpoch - daysFromSunday * DAY_IN_MS);
      let saturday = new Date(todayEpoch + daysToSaturday * DAY_IN_MS);

      this.getData(sunday, saturday);
    })
  }
  
  getData(startDate: Date, endDate: Date) {
    let sunday = startDate.toISOString().slice(0,10);
    let saturday = endDate.toISOString().slice(0,10);
    let url = this.apiUrl + `workEvents?start=${sunday}&end=${saturday}`;
    return this.http.get(url).subscribe(res => {
      console.log(res);
    });
  }

}
