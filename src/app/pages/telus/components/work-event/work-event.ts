import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TelusService } from '../../services/Telus.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Telus } from '../../Telus';

@Component({
  selector: 'app-work-event',
  imports: [AsyncPipe],
  templateUrl: './work-event.html',
  styleUrl: './work-event.css',
})
export class WorkEvent {
  @Input() dayOfWeek: string | undefined;
  @Input() id: number | undefined;
  @Input() start: string | undefined;
  @Input() stop: string | undefined;
  @Output() updateComplete = new EventEmitter<void>();

  private service = inject(TelusService);
  private master = inject(Telus);
  
  private stopSubject = new BehaviorSubject<string | undefined>(undefined);
  stop$?: Observable<string | undefined> = this.stopSubject.asObservable();

  ngOnInit() {
    if (this.stop) {
      this.stopSubject.next(this.stop);
    }
  }

  stopEvent(id: number) {
    this.service.stopWorkEvent(id).pipe(
      map(res => res.stop)
    ).subscribe({
      next: stopValue => {
        this.stopSubject.next(stopValue);
        this.updateComplete.emit();
      },
      error: err => console.error(err)
    });
  }

  deleteEvent(id: number) {
    this.service.deleteWorkEvent(id).subscribe({
      complete: (() => {
        this.master.deleteWorkEvent(id);
      })
    })
  }
}
