import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { TaskEntity } from '../../../../core/models/entities';

@Component({
  selector: 'app-tasks-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tasks-container">
      <div class="widget-panel list-panel">
        <div class="panel-header">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span>Meine Aufgaben</span>
        </div>
        
        <div class="task-list">
          <div *ngFor="let task of tasks" 
               class="task-item" 
               [class.active]="selectedTask()?.id === task.id"
               (click)="selectTask(task)">
            <input type="checkbox" 
                   [checked]="task.status === 'erledigt'" 
                   (change)="toggleTaskStatus(task)"
                   (click)="$event.stopPropagation()">
            <div class="task-info">
              <span class="title">{{ task.title }}</span>
              <div class="meta">
                <span class="due" *ngIf="task.dueDate">{{ task.dueDate | date:'d. MMM' }}</span>
                <span class="area-tag" *ngIf="task.areaId">{{ getAreaName(task.areaId) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="widget-panel detail-panel">
        <div *ngIf="selectedTask() as task; else placeholder" class="task-detail">
          <input class="detail-title" [(ngModel)]="task.title" placeholder="Aufgabentitel">
          <textarea class="detail-description" [(ngModel)]="task.details" placeholder="Notizen..."></textarea>
          
          <div class="detail-fields">
            <div class="field">
              <label>Fälligkeit</label>
              <span>{{ task.dueDate ? (task.dueDate | date:'dd.MM.yyyy') : 'Kein Datum' }}</span>
            </div>
            <div class="field">
              <label>Status</label>
              <select [(ngModel)]="task.status">
                <option value="offen">Offen</option>
                <option value="in Arbeit">In Arbeit</option>
                <option value="erledigt">Erledigt</option>
              </select>
            </div>
          </div>
        </div>
        
        <ng-template #placeholder>
          <div class="detail-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="placeholder-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <p>Aufgabe auswählen für Details</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .tasks-container {
      display: flex;
      gap: 1rem;
      height: 400px;
    }
    .widget-panel {
      background: var(--bg-canvas);
      border-radius: 1.5rem;
      border: 1px solid rgba(0,0,0,0.05);
      box-shadow: 0 4px 16px rgba(0,0,0,0.03);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
    }
    .list-panel { flex: 0 0 45%; }
    .detail-panel { flex: 1; }
    
    .panel-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-weight: 600;
      color: var(--text-main);
      .icon { width: 1.25rem; height: 1.25rem; color: #10b981; }
    }

    .task-list {
      overflow-y: auto;
      flex: 1;
    }
    .task-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: background 0.2s;
      
      &:hover { background: rgba(0,0,0,0.02); }
      &.active { background: rgba(var(--primary-rgb), 0.05); border: 1px solid rgba(var(--primary-rgb), 0.1); }
      
      input[type="checkbox"] {
        width: 1.125rem;
        height: 1.125rem;
        border-radius: 0.35rem;
        accent-color: var(--primary);
      }
    }
    .task-info {
      .title { font-size: 0.875rem; font-weight: 500; display: block; }
      .meta {
        font-size: 0.75rem;
        color: var(--text-secondary);
        display: flex;
        gap: 0.5rem;
        margin-top: 0.25rem;
      }
      .area-tag {
        background: rgba(0,0,0,0.04);
        padding: 1px 6px;
        border-radius: 0.25rem;
      }
    }

    .task-detail {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        height: 100%;
        
        .detail-title {
            font-size: 1.125rem;
            font-weight: 600;
            border: none;
            outline: none;
            background: transparent;
            width: 100%;
        }
        .detail-description {
            flex: 1;
            border: none;
            outline: none;
            resize: none;
            background: rgba(0,0,0,0.02);
            border-radius: 0.75rem;
            padding: 0.75rem;
            font-size: 0.875rem;
        }
    }
    .detail-fields {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        
        .field {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            label { font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; }
            span, select { font-size: 0.875rem; }
            select { border: 1px solid rgba(0,0,0,0.1); border-radius: 0.5rem; padding: 0.25rem; }
        }
    }
    .detail-placeholder {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
        gap: 0.5rem;
        .placeholder-icon { width: 3rem; height: 3rem; opacity: 0.2; }
    }
  `]
})
export class TasksWidgetComponent {
  private mockData = inject(MockDataService);
  tasks = this.mockData.getTasks();
  selectedTask = signal<TaskEntity | null>(null);

  selectTask(task: TaskEntity) {
    this.selectedTask.set(task);
  }

  toggleTaskStatus(task: TaskEntity) {
    task.status = task.status === 'erledigt' ? 'offen' : 'erledigt';
  }

  getAreaName(areaId: string): string {
    const area = this.mockData.getAreas().find(a => a.id === areaId);
    return area ? area.title : 'Kein Bereich';
  }
}
