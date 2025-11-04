import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

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
}
