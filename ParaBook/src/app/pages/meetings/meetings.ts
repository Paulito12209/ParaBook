import { Component, inject, Signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../core/database/db.service';
import { MeetingEntity } from '../../core/models/entities';
import { liveQuery } from 'dexie';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppStateService } from '../../core/services/app-state.service';
import { ShortcutService } from '../../core/services/shortcut.service';
import { MeetingListComponent } from '../../shared/components/meetings/meeting-list/meeting-list';
import { MeetingDetailsComponent } from '../../shared/components/meetings/meeting-details/meeting-details';

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [CommonModule, MeetingListComponent, MeetingDetailsComponent],
  templateUrl: './meetings.html',
  styleUrl: './meetings.scss',
})
export class Meetings {
  private db = inject(DatabaseService);
  appState = inject(AppStateService);
  private shortcutService = inject(ShortcutService);

  meetings: Signal<MeetingEntity[]> = toSignal(
    liveQuery(() => this.db.meetings.orderBy('date').reverse().toArray()), 
    { initialValue: [] as MeetingEntity[] }
  ) as Signal<MeetingEntity[]>;

  selectedMeeting: MeetingEntity | null = null;
  selectedMeetingId: string | null = null;
  isResizing = false;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;
    const newWidth = Math.max(400, event.clientX);
    this.appState.setGlobalSidebarWidth(newWidth);
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isResizing = false;
    document.body.style.cursor = 'default';
  }

  startResizing(event: MouseEvent) {
    event.preventDefault();
    this.isResizing = true;
    document.body.style.cursor = 'col-resize';
  }

  onMeetingSelected(meeting: MeetingEntity) {
    this.selectedMeetingId = meeting.id;
    this.selectedMeeting = meeting;
  }

  onAddMeeting() {
    this.shortcutService.toggleSearchModal();
  }

  async onDeleteMeeting(id: string) {
    if (this.selectedMeetingId === id) {
        this.selectedMeetingId = null;
        this.selectedMeeting = null;
    }
    await this.db.meetings.delete(id);
  }
}

