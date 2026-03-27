import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingEntity } from '../../../../core/models/entities';
import { AppStateService } from '../../../../core/services/app-state.service';

@Component({
  selector: 'app-meeting-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meeting-list.html',
  styleUrl: './meeting-list.scss',
})
export class MeetingListComponent {
  @Input() meetings: MeetingEntity[] = [];
  @Output() meetingSelected = new EventEmitter<MeetingEntity>();
  @Output() addMeeting = new EventEmitter<void>();

  appState = inject(AppStateService);
  selectedMeetingId: string | null = null;

  selectMeeting(meeting: MeetingEntity) {
    this.selectedMeetingId = meeting.id;
    this.meetingSelected.emit(meeting);
  }

  onAdd() {
    this.addMeeting.emit();
  }
}
