import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'telus-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './DayChart.telus.html',
  styleUrl: './DayChart.telus.css'
})
export class DayChart {
  startDate: Date | null = null;
  endDate: Date | null = null;
  id: number | null = null;
  dayOfWeek: string | null = null;
}
