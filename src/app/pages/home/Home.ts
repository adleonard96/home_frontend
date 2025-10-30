import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'home-root',
  imports: [RouterOutlet],
  templateUrl: './Home.html',
  styleUrl: './Home.css'
})
export class Home {}
