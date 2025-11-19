import { Component, inject, Inject, Input } from '@angular/core';
import { TelusService } from '../../services/Telus.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-form',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-form.html',
  styleUrl: './edit-form.css',
})
export class EditForm {
  @Input() id: number = Infinity;
  @Input() start: string  | undefined= '';
  @Input() stop: string | null | undefined= null;
  @Input() dayOfWeek: string | undefined= '';
  @Input() closeFn: any;
  @Input() updateEvent: any;

  formStart = new FormControl(new Date());
  formStop = new FormControl(new Date());


  private service = inject(TelusService);

  close() {
    if (this.closeFn) {
      this.closeFn();
    }
  }

  submit(start: string, stop: string) {
    let updatedEvent = this.service.updateWorkEvent(this.id, new Date(start), new Date(stop));
  }
}
