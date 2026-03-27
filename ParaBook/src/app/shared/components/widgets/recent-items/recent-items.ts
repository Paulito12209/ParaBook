import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService, VisitedPage } from '../../../../core/services/app-state.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-recent-items',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="recent-section">
      <div class="section-header">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span>Kürzlich besucht</span>
      </div>
      
      <div class="items-carousel" (wheel)="onWheel($event)">
        <!-- Verwendung der AsyncPipe zur Vermeidung von NG0100 Fehlern -->
        <ng-container *ngIf="items$ | async as recentItems">
          <div *ngFor="let item of recentItems" class="item-card">
            <div class="card-cover" [ngClass]="getCoverClass(item.type)">
              <div class="icon-wrapper" [ngSwitch]="item.type">
                <!-- Task -->
                <svg *ngSwitchCase="'Task'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="large-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
                <!-- Meeting -->
                <svg *ngSwitchCase="'Meeting'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="large-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <!-- Resource -->
                <svg *ngSwitchCase="'Resource'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="large-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
                </svg>
                <!-- Project -->
                <svg *ngSwitchCase="'Project'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="large-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>
                <!-- Default (Area / Other) -->
                <svg *ngSwitchDefault xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="large-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
                </svg>
              </div>
            </div>
            <div class="card-content">
              <h3 class="title">{{ item.title }}</h3>
              <span class="timestamp">{{ formatTime(item.timestamp) }}</span>
            </div>
          </div>
          
          <div *ngIf="recentItems.length === 0" class="empty-state">
            Keine kürzlich besuchten Seiten vorhanden.
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .recent-section {
      margin-bottom: 2rem;
    }
    .section-header {
      display: flex;
      items-center: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      
      .icon { width: 1.25rem; height: 1.25rem; }
    }
    .items-carousel {
      display: inline-flex;
      max-width: 100%;
      gap: 1rem;
      overflow-x: auto;
      padding: 4px 4px 12px 4px;
      margin: -4px -4px 0 -4px;
      scrollbar-width: none;
      -ms-overflow-style: none;
      
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .item-card {
      width: 160px;
      flex: 0 0 auto;
      background: var(--bg-canvas);
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
      border: 1px solid rgba(0,0,0,0.05);
      transition: transform 0.2s;
      cursor: pointer;
      
      &:hover { transform: scale(1.02); }
    }
    .card-cover {
      height: 80px;
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: center;
    }
    
    .bg-project { background: linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.02)); color: #ef4444; }
    .bg-area { background: linear-gradient(135deg, rgba(234,179,8,0.1), rgba(234,179,8,0.02)); color: #eab308; }
    .bg-resource { background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.02)); color: #3b82f6; }
    .bg-task { background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02)); color: #10b981; }
    .bg-meeting { background: linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.02)); color: #8b5cf6; }
    .bg-default { background: linear-gradient(135deg, rgba(107,114,128,0.1), rgba(107,114,128,0.02)); color: #6b7280; }

    .large-icon {
      position: absolute;
      bottom: -24px;
      left: 50%;
      transform: translateX(-50%);
      width: 72px;
      height: 72px;
      opacity: 0.9;
    }
    .card-content {
      padding: 0.75rem;
      
      .title {
        font-size: 0.875rem;
        font-weight: 600;
        margin: 0;
        color: var(--text-main);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .timestamp {
        font-size: 0.75rem;
        color: var(--text-secondary);
        display: block;
        margin-top: 0.25rem;
      }
    }
    .empty-state {
      color: var(--text-secondary);
      font-size: 0.875rem;
      padding: 2rem;
    }
  `]
})
export class RecentItemsComponent {
  private appState = inject(AppStateService);
  
  /**
   * Observable der zuletzt besuchten Seiten.
   * delay(0) verhindert 'ExpressionChangedAfterItHasBeenCheckedError' (NG0100).
   */
  items$ = toObservable(this.appState.lastVisitedPages).pipe(delay(0));

  getCoverClass(type: string): string {
    switch(type) {
      case 'Project': return 'bg-project';
      case 'Area': return 'bg-area';
      case 'Resource': return 'bg-resource';
      case 'Task': return 'bg-task';
      case 'Meeting': return 'bg-meeting';
      default: return 'bg-default';
    }
  }

  formatTime(timestamp: number): string {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `vor ${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `vor ${hours}h`;
    const days = Math.floor(hours / 24);
    return `vor ${days}d`;
  }

  onWheel(event: WheelEvent) {
    const el = event.currentTarget as HTMLElement;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      el.scrollLeft += event.deltaY;
    }
  }
}
