import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { TelusService } from '../../services/Telus.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { error } from 'node:console';

@Component({
  selector: 'app-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-form.html',
  styleUrl: './edit-form.css',
})
export class EditForm implements OnChanges {
  @Input() id: number = Infinity;
  @Input() start: string | undefined = '';
  @Input() stop: string | null | undefined = null;
  @Input() dayOfWeek: string | undefined = '';
  @Input() closeFn: any;
  @Input() updateEvent: any;
  

  formStart = new FormControl<string | null | undefined>(null);
  formStop = new FormControl<string | null | undefined>(null);

  private service = inject(TelusService);

  ngOnChanges() {
    this.formStart.setValue(this.toLocalInputValue(this.start));
    this.formStop.setValue(this.toLocalInputValue(this.stop));
  }

  private toLocalInputValue(dateString?: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  }

  close() {
    this.closeFn?.();
  }

  submit() {
    if (!this.formStart.value || !this.formStop.value) return;

    this.service.updateWorkEvent(this.id, new Date(this.formStart.value), new Date(this.formStop.value)).subscribe(
      value => {
        this.formStop.setValue(value.stop),
        this.formStart.setValue(value.start)
        this.updateEvent(value.start, value.stop, value.dayOfWeek)
      },
      error => {
        console.error(error);
        alert("Error updating")
      } 
    );
  }
}
