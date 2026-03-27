import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService, VisitedPage } from '../../../../core/services/app-state.service';

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
      
      <div class="items-carousel">
        <div *ngFor="let item of items()" class="item-card">
          <div class="card-cover">
            <!-- IconPlaceholder oder Cover -->
            <div class="icon-placeholder">
              <span class="type-icon">{{ getTypeIcon(item.type) }}</span>
            </div>
          </div>
          <div class="card-content">
            <h3 class="title">{{ item.title }}</h3>
            <span class="timestamp">{{ formatTime(item.timestamp) }}</span>
          </div>
        </div>
        
        <!-- Placeholder wenn leer -->
        <div *ngIf="items().length === 0" class="empty-state">
          Keine kürzlich besuchten Seiten vorhanden.
        </div>
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
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      scrollbar-width: thin;
      
      &::-webkit-scrollbar { height: 4px; }
      &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
    }
    .item-card {
      min-width: 140px;
      background: var(--bg-canvas);
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
      border: 1px solid rgba(0,0,0,0.05);
      transition: transform 0.2s;
      cursor: pointer;
      
      &:hover { transform: translateY(-2px); }
    }
    .card-cover {
      height: 80px;
      background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-placeholder {
      width: 40px;
      height: 40px;
      background: white;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
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
  items = this.appState.lastVisitedPages;

  getTypeIcon(type: string): string {
    switch(type) {
      case 'Project': return '📂';
      case 'Resource': return '📄';
      case 'Task': return '✅';
      case 'Meeting': return '📅';
      default: return '📍';
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
}
