import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../../../core/services/app-state.service';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { ResourceEntity } from '../../../../core/models/entities';

@Component({
  selector: 'app-resources-matrix',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="resources-matrix">
      <!-- Zeile 1: Favoriten-Projekt -->
      <div class="row">
        <div class="row-header">
           <span class="emoji">📌</span>
           <span class="header-text">{{ favoriteProjectTitle() }}</span>
        </div>
        <div class="row-items">
           <div *ngFor="let res of favoriteResources()" class="resource-pill">
             <span class="res-icon">{{ getFileIcon(res.type) }}</span>
             <span class="res-title">{{ res.title }}</span>
           </div>
           <div *ngIf="favoriteResources().length === 0" class="empty-pill">
             {{ appState.favoriteProjectId() ? 'Keine Ressourcen gefunden' : 'Markiere ein Projekt als Favorit' }}
           </div>
        </div>
      </div>

      <!-- Zeile 2: Zuletzt aktiver Arbeitsbereich -->
      <div class="row">
        <div class="row-header">
           <span class="emoji">🗂</span>
           <span class="header-text">{{ activeWorkspaceTitle() }}</span>
        </div>
        <div class="row-items">
           <div *ngFor="let res of workspaceResources()" class="resource-pill">
             <span class="res-icon">📄</span>
             <span class="res-title">{{ res.title }}</span>
           </div>
            <div *ngIf="workspaceResources().length === 0" class="empty-pill">Keine Ressourcen ermittelbar</div>
        </div>
      </div>

      <!-- Zeile 3: Aktuelles Projekt (Zuletzt geöffnet) -->
      <div class="row">
        <div class="row-header">
           <span class="emoji">📂</span>
           <span class="header-text">{{ lastOpenedProjectTitle() }}</span>
        </div>
        <div class="row-items">
           <div *ngFor="let res of projectResources()" class="resource-pill">
             <span class="res-icon">{{ getFileIcon(res.type) }}</span>
             <span class="res-title">{{ res.title }}</span>
           </div>
           <div *ngIf="projectResources().length === 0" class="empty-pill">Kein Projekt zuletzt geöffnet</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .resources-matrix {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-top: 1rem;
    }
    .row {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .row-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text-main);
      .emoji { font-size: 1.125rem; }
    }
    .row-items {
      display: flex;
      gap: 0.75rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
    }
    .resource-pill {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--bg-canvas);
      border: 1px solid rgba(0,0,0,0.05);
      border-radius: 2rem;
      white-space: nowrap;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
      transition: all 0.2s;
      
      &:hover { background: rgba(var(--primary-rgb), 0.03); border-color: rgba(var(--primary-rgb), 0.2); }
      .res-title { font-size: 0.875rem; font-weight: 500; }
    }
    .empty-pill {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-style: italic;
      padding: 0.5rem 0;
    }
  `]
})
export class ResourcesMatrixComponent {
  public appState = inject(AppStateService);
  private mockData = inject(MockDataService);

  favoriteProjectTitle = computed(() => {
    const id = this.appState.favoriteProjectId();
    const proj = this.mockData.getProjects().find(p => p.id === id);
    return proj ? proj.title : 'Kein Favorit gesetzt';
  });

  favoriteResources = computed(() => {
    const id = this.appState.favoriteProjectId();
    if (!id) return [];
    return this.mockData.getResources().filter(r => r.projectIds.includes(id));
  });

  activeWorkspaceTitle = computed(() => {
    const id = this.appState.lastActiveWorkspaceId();
    const area = this.mockData.getAreas().find(a => a.id === id);
    return area ? area.title : 'Zuletzt aktiver Arbeitsbereich';
  });

  workspaceResources = computed(() => {
    const id = this.appState.lastActiveWorkspaceId();
    if (!id) return [];
    return this.mockData.getResources().filter(r => r.areaIds.includes(id));
  });

  lastOpenedProjectTitle = computed(() => {
    const id = this.appState.lastOpenedProjectId();
    const proj = this.mockData.getProjects().find(p => p.id === id);
    return proj ? proj.title : 'Zuletzt geöffnetes Projekt';
  });

  projectResources = computed(() => {
    const id = this.appState.lastOpenedProjectId();
    if (!id) return [];
    return this.mockData.getResources().filter(r => r.projectIds.includes(id));
  });

  getFileIcon(type: string): string {
    switch(type) {
      case 'Dokumentation': return '📑';
      case 'SOP': return '⚙️';
      case 'Notiz': return '📝';
      default: return '📄';
    }
  }
}
