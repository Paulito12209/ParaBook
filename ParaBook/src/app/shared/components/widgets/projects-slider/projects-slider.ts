import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../../../core/database/db.service';
import { ProjectEntity, AreaEntity } from '../../../../core/models/entities';
import { liveQuery } from 'dexie';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-projects-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="projects-layout">
      <!-- Slider Area -->
      <div class="slider-area">
        <div class="section-header">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
          </svg>
          <span>Meine Projekte</span>
        </div>
        
        <div class="slider-cards" (wheel)="onWheel($event)">
          <div *ngFor="let proj of projects()" 
               class="project-card" 
               (click)="openProject(proj.id)">
            <div class="card-cover">
               <div class="cover-pattern" [style.background-color]="getProjectColor(proj.id)"></div>
            </div>
            <div class="card-content">
              <h3 class="title">{{ proj.title }}</h3>
              
              <div class="pill-container">
                <span *ngIf="proj.areaIds && proj.areaIds.length > 0" class="area-pill">
                  {{ getAreaName(proj.areaIds[0]) }}
                </span>
                
                <button *ngIf="!proj.areaIds || proj.areaIds.length === 0" class="link-area-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="btn-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Arbeitsbereich verknüpfen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Compact List Area -->
      <div class="compact-list-area">
        <div class="section-header">
          <span>Zuletzt erstellt</span>
        </div>
        <div class="widget-panel list-container">
          <div *ngFor="let proj of projects()?.slice(0, 4)" class="compact-project">
            <div class="compact-content">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="proj-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
              <span class="title">{{ proj.title }}</span>
            </div>
            <span class="due-date" *ngIf="proj.dueDate">{{ proj.dueDate | date:'dd. MMM' }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .projects-layout {
      margin-top: 2rem;
      margin-bottom: 2rem;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }
    .slider-area {
      overflow: hidden;
    }
    .compact-list-area {
      display: flex;
      flex-direction: column;
    }
    .list-container {
      background: var(--bg-canvas);
      border-radius: 1.5rem;
      border: 1px solid rgba(0,0,0,0.05);
      box-shadow: 0 4px 16px rgba(0,0,0,0.03);
      padding: 1rem 1.25rem;
      height: 100%;
      min-height: 200px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .compact-project {
      padding: 0.5rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .compact-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .proj-icon { width: 1.1rem; height: 1.1rem; color: var(--text-secondary); }
      .due-date { font-size: 0.75rem; color: var(--text-secondary); }
      .title {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-main);
      }
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
    }
    .section-header .icon { 
      width: 1.25rem; 
      height: 1.25rem; 
    }
    .slider-cards {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      padding: 8px 4px 16px 4px;
      margin: -8px -4px 0 -4px;
      scrollbar-width: none;
      -ms-overflow-style: none;
      
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .project-card {
      min-width: 220px;
      background: var(--bg-canvas);
      border-radius: 1.25rem;
      overflow: hidden;
      box-shadow: 0 4px 14px rgba(0,0,0,0.03);
      border: 1px solid rgba(0,0,0,0.05);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      &:hover {
        transform: scale(1.02);
        box-shadow: 0 12px 24px rgba(0,0,0,0.06);
        border-color: rgba(var(--text-secondary-rgb), 0.15);
      }
    }
    .card-cover {
      height: 100px;
      overflow: hidden;
      background: #f8fafc;
    }
    .cover-pattern {
      width: 100%;
      height: 100%;
      opacity: 0.2;
      background-image: radial-gradient(#000 1px, transparent 1px);
      background-size: 10px 10px;
    }
    .card-content {
      padding: 1rem;
      .title { font-size: 1rem; font-weight: 600; margin: 0 0 0.75rem 0; color: var(--text-main); }
    }
    .area-pill {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      background: rgba(var(--primary-rgb), 0.1);
      color: var(--primary);
      border-radius: 2rem;
    }
    .link-area-btn {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      padding: 0.375rem 0.75rem;
      border: 1px dashed rgba(0,0,0,0.2);
      border-radius: 2rem;
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
      &:hover { background: rgba(0,0,0,0.02); color: var(--text-main); border-color: rgba(0,0,0,0.4); }
      .btn-icon { width: 1rem; height: 1rem; }
    }
  `]
})
export class ProjectsSliderComponent {
  private db = inject(DatabaseService);

  projects: Signal<ProjectEntity[]> = toSignal(
    liveQuery(() => this.db.projects.orderBy('createdAt').reverse().toArray()),
    { initialValue: [] as ProjectEntity[] }
  ) as Signal<ProjectEntity[]>;

  areas: Signal<AreaEntity[]> = toSignal(
    liveQuery(() => this.db.areas.toArray()),
    { initialValue: [] as AreaEntity[] }
  ) as Signal<AreaEntity[]>;

  selectedProjectId: string | undefined;

  getAreaName(areaId: string): string {
    const area = this.areas().find(a => a.id === areaId);
    return area ? area.title : 'Kein Bereich';
  }

  openProject(projectId: string) {
    this.selectedProjectId = projectId;
  }

  onWheel(event: WheelEvent) {
    const el = event.currentTarget as HTMLElement;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      el.scrollLeft += event.deltaY;
    }
  }

  getProjectColor(id: string): string {
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const index = id.length || 0;
    return colors[index % colors.length];
  }
}
