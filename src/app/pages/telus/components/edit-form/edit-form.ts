import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit-form',
  imports: [],
  templateUrl: './edit-form.html',
  styleUrl: './edit-form.css',
})
export class EditForm {
  @Input() id: number = Infinity;
  @Input() start: string  | undefined= '';
  @Input() stop: string | null | undefined= null;
  @Input() dayOfWeek: string | undefined= '';
}
