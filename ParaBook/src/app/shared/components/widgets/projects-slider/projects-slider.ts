import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { ProjectEntity } from '../../../../core/models/entities';

@Component({
  selector: 'app-projects-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="projects-section">
      <div class="section-header">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.625-1.219c.337.158.736.19 1.093.092l.337-.092m-8.625-1.219a.75.75 0 0 1 .556-.75l.337-.092m11.332 5.093.337.092a.75.75 0 0 1 .556.75v3a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25v-3a.75.75 0 0 1 .556-.75l.337-.092m9.962-3.214.337.092a.75.75 0 0 1 .556.75v3a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25v-3a.75.75 0 0 1 .556-.75l.337-.092" />
        </svg>
        <span>Meine Projekte</span>
      </div>
      
      <div class="projects-carousel">
        <div *ngFor="let project of projects" class="project-card">
          <div class="card-cover">
             <div class="cover-pattern" [style.background-color]="getProjectColor(project.id)"></div>
          </div>
          <div class="card-content">
            <h3 class="title">{{ project.title }}</h3>
            
            <div class="pill-container">
              <span *ngIf="project.areaIds && project.areaIds.length > 0" class="area-pill">
                {{ getAreaName(project.areaIds[0]) }}
              </span>
              
              <button *ngIf="!project.areaIds || project.areaIds.length === 0" class="link-area-btn">
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
  `,
  styles: [`
    .projects-section {
      margin-top: 2rem;
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
    .projects-carousel {
      display: flex;
      gap: 1.25rem;
      overflow-x: auto;
      padding-bottom: 1rem;
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
      &:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
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
  private mockData = inject(MockDataService);
  projects = this.mockData.getProjects().sort((a,b) => b.createdAt - a.createdAt);

  getAreaName(areaId: string): string {
    const area = this.mockData.getAreas().find(a => a.id === areaId);
    return area ? area.title : 'Kein Bereich';
  }

  getProjectColor(id: string): string {
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const index = id.length || 0;
    return colors[index % colors.length];
  }
}
