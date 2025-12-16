import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { error } from 'node:console';
import { HttpResponses } from "../models/HttpResponses";
import { Observable } from 'rxjs';
import DateTimeUtility from '../../../date-time-utility';

@Injectable({ providedIn: 'root' })
export class TimeTrackingService {
  private http = inject(HttpClient);
  private apiUrl = `http://192.168.1.21:8081/`;
  
  deleteWorkEvent(id: number) {
    let url = this.apiUrl + "workEvent/" +id;
    return this.http.delete(url);
  }
  
  getWorkEvents(start: Date, end: Date) {
    start.setHours(12);
    end.setHours(12);
    let sunday = start.toISOString().slice(0, 10);
    let saturday = end.toISOString().slice(0, 10);
    let url = this.apiUrl + `v2/workEvents?start=${sunday}&end=${saturday}`;
    return this.http.get<Array<HttpResponses.event>>(url);
  }
  
  createWorkEvent(start: Date): Observable<HttpResponses.event> {
    return this.http.post<HttpResponses.event>(this.apiUrl + 'workEvent', {
      "start": DateTimeUtility.UtcStringWithoutOffset(start),
      "dayOfWeek": this.getDayString(start.getDay())
    })
  }

  resumeEvent(id: number) {
    return this.http.patch(this.apiUrl + 'workEvent/resume/' + id,{})
  }
  
  updateWorkEvent(id: number, start: Date, stop: Date){
    return this.http.patch<HttpResponses.event>(this.apiUrl + 'workEvent', {
      "start": DateTimeUtility.UtcStringWithoutOffset(start),
      "stop": DateTimeUtility.UtcStringWithoutOffset(stop),
      "dayOfWeek": this.getDayString(start.getDay()),
      "id": id
    })
  }

  stopWorkEvent(id: number): Observable<HttpResponses.event> {
    return this.http.patch(this.apiUrl+'workEvent/stop/'+id,null) as Observable<HttpResponses.event>;
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
    } as const;

    return dateGetter[dayOfWeek];
  }

}
