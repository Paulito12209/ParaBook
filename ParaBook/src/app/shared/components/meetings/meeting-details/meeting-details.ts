import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingEntity } from '../../../../core/models/entities';
import { DatabaseService } from '../../../../core/database/db.service';

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

  private db = inject(DatabaseService);

  onClose() {
    this.close.emit();
  }

  onDelete() {
    if (this.meeting) {
      this.delete.emit(this.meeting.id);
    }
  }

  /**
   * Archiviert das Meeting.
   */
  async onArchive() {
    if (!this.meeting) return;
    await this.db.meetings.update(this.meeting.id, {
      isArchived: true,
      updatedAt: Date.now()
    });
    this.onClose();
  }
}
