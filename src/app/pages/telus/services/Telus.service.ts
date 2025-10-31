import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class TelusService {
    private http = inject(HttpClient);

    getWorkEvents(start: Date, end:Date) {
        
    }
}