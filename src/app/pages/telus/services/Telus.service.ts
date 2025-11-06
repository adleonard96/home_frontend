import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { error } from 'node:console';

@Injectable({ providedIn: 'root' })
export class TelusService {
  private http = inject(HttpClient);
  private apiUrl = `http://192.168.1.21:8081/`;

  getWorkEvents(start: Date, end: Date) {
    let sunday = start.toISOString().slice(0, 10);
    let saturday = end.toISOString().slice(0, 10);
    let url = this.apiUrl + `workEvents?start=${sunday}&end=${saturday}`;
    this.http.get(url).subscribe((res) => {
      return res;
    });
  }

  createWorkEvent(start: Date) {
    this.http.post(this.apiUrl + 'workEvent', {
      "start": start.toISOString().slice(0,19),
      "dayOfWeek": this.getDayString(start.getDay())
    }).subscribe({
      next: (response) => {
        console.log(response)
      },
      error: (error) => {
        console.error(error)
      },
      complete: () => {
        console.log('Event created')
      }
    })
  }

  private getDayString(dayOfWeek: number): string {
    if (dayOfWeek > 6 || dayOfWeek < 0) {
      throw new Error("Date range is incorrect");
    }
    const dateGetter: any = {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday"
    }

    return dateGetter[dayOfWeek];
  }

}
