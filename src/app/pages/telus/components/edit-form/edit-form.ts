import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit-form',
  imports: [],
  templateUrl: './edit-form.html',
  styleUrl: './edit-form.css',
})
export class EditForm {
  @Input() id: number = Infinity;
  @Input() start: Date = new Date();
  @Input() end: Date = new Date();
}
