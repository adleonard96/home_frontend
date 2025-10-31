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
      this.getData();
    })
  }
  
  getData() {
    let url = this.apiUrl + 'workEvents?start=2025-07-01&end=2025-12-31'
    return this.http.get(url).subscribe(res => {
      console.log(res);
    });
  }

}
