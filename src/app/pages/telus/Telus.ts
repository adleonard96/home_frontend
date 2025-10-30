import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'telus-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './Telus.html',
  styleUrl: './Telus.css'
})
export class Telus {}
