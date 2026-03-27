import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingEntity } from '../../../../core/models/entities';

@Component({
  selector: 'app-meeting-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meeting-details.html',
  styleUrl: './meeting-details.scss',
})
export class MeetingDetailsComponent {
  @Input() meeting: MeetingEntity | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();

  onClose() {
    this.close.emit();
  }

  onDelete() {
    if (this.meeting) {
      this.delete.emit(this.meeting.id);
    }
  }
}
