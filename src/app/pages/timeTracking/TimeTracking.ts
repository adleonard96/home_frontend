import {
  Component,
  effect,
  EventEmitter,
  inject,
  Injectable,
  Output,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventList } from './components/event-list/event-list';

@Component({
  selector: 'timeTracking-root',
  imports: [RouterModule, EventList],
  templateUrl: './TimeTracking.html',
  styleUrl: './TimeTracking.css',
})
@Injectable({ providedIn: 'root' })
export class TimeTracking {
}
