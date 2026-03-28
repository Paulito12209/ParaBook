import { Component, EventEmitter, Input, Output, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeetingEntity } from '../../../../core/models/entities';
import { DatabaseService } from '../../../../core/database/db.service';
import { TaskLinkPanelComponent } from '../../tasks/task-link-panel/task-link-panel';
import { toSignal } from '@angular/core/rxjs-interop';
import { liveQuery } from 'dexie';

@Component({
  selector: 'app-meeting-details',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskLinkPanelComponent],
  templateUrl: './meeting-details.html',
  styleUrl: './meeting-details.scss',
})
export class MeetingDetailsComponent {
  @Input() meeting: MeetingEntity | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();

  private db = inject(DatabaseService);

  isTaskPanelOpen = false;

  /** Zählt die verknüpften Aufgaben live aus der Datenbank */
  linkedTasksCount: Signal<number> = toSignal(
    liveQuery(() => {
      if (!this.meeting) return Promise.resolve(0);
      return this.db.tasks
        .where('meetingIds')
        .equals(this.meeting.id)
        .count();
    }),
    { initialValue: 0 }
  );

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

  /** Aktualisiert den Titel in der Datenbank */
  async updateMeeting() {
    if (!this.meeting) return;
    await this.db.meetings.update(this.meeting.id, {
      title: this.meeting.title,
      updatedAt: Date.now()
    });
  }

  toggleTaskPanel() {
    this.isTaskPanelOpen = !this.isTaskPanelOpen;
  }
}
