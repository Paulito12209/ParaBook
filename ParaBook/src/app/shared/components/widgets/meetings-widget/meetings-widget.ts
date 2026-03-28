import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../../../core/services/mock-data.service';

@Component({
  selector: 'app-meetings-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="widget-wrapper">
      <div class="section-header">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
        <span>Termine & Meetings</span>
      </div>

      <div class="meetings-panel widget-panel">
        <div class="meeting-list">
          <ng-container *ngFor="let group of groupedMeetings()">
            <div class="group-label">{{ group.label }}</div>
            <div *ngFor="let meet of group.meetings" class="meeting-item">
              <div class="time-indicator" [style.background]="getIndicatorColor(meet.id)"></div>
              <div class="meeting-content">
                <span class="time">{{ meet.scheduledFor | date:'HH:mm' }}</span>
                <span class="title">{{ meet.title }}</span>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .widget-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      max-width: 400px;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    .section-header .icon {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--text-secondary);
    }
    .widget-panel {
      background: var(--bg-canvas);
      border-radius: 1.5rem;
      border: 1px solid rgba(0,0,0,0.05);
      box-shadow: 0 4px 16px rgba(0,0,0,0.03);
      padding: 1.25rem;
      height: 400px;
      display: flex;
      flex-direction: column;
    }
    .meeting-list {
      overflow-y: auto;
      flex: 1;
    }
    .group-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
      margin: 1rem 0 0.5rem 0;
      &:first-child { margin-top: 0; }
    }
    .meeting-item {
      display: flex;
      gap: 0.75rem;
      padding: 0.625rem 0;
      border-bottom: 1px solid rgba(0,0,0,0.02);
      
      &:last-child { border-bottom: none; }
    }
    .time-indicator {
      width: 4px;
      border-radius: 2px;
      height: auto;
    }
    .meeting-content {
      display: flex;
      flex-direction: column;
      
      .time { font-size: 0.75rem; font-weight: 600; color: var(--primary); }
      .title { font-size: 0.875rem; color: var(--text-main); font-weight: 500; }
    }
  `]
})
export class MeetingsWidgetComponent {
  private mockData = inject(MockDataService);
  
  groupedMeetings() {
    const meetings = this.mockData.getMeetings();
    const today = new Date().setHours(0,0,0,0);
    const tomorrow = new Date(today + 86400000).getTime();

    const result = [
      { label: 'Heute', meetings: meetings.filter(m => m.scheduledFor! >= today && m.scheduledFor! < tomorrow) },
      { label: 'Morgen', meetings: meetings.filter(m => m.scheduledFor! >= tomorrow && m.scheduledFor! < tomorrow + 86400000) },
      { label: 'Demnächst', meetings: meetings.filter(m => m.scheduledFor! >= tomorrow + 86400000) }
    ];
    return result.filter(g => g.meetings.length > 0);
  }

  getIndicatorColor(id: string): string {
    const colors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa'];
    const index = parseInt(id.split('-')[1]) || 0;
    return colors[index % colors.length];
  }
}
