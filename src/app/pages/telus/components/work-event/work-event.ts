import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-work-event',
  imports: [],
  templateUrl: './work-event.html',
  styleUrl: './work-event.css',
})
export class WorkEvent {
  @Input() dayOfWeek: string | undefined;
  @Input() id: number | undefined;
  @Input() start: string | undefined;
  @Input() stop: string | undefined;
}
