import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'telus-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './DayChart.telus.html',
  styleUrl: './DayChart.telus.css'
})
export class DayChart {}
