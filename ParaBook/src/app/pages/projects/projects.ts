import { Component, inject, Signal, computed, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../core/database/db.service';
import { ProjectEntity } from '../../core/models/entities';
import { liveQuery } from 'dexie';
import { toSignal } from '@angular/core/rxjs-interop';
import { SharedProjectList, ProjectListItem } from '../../shared/components/project-list/project-list';
import { SharedProjectDetails, ProjectDetailsItem } from '../../shared/components/project-details/project-details';
import { AppStateService } from '../../core/services/app-state.service';
import { ShortcutService } from '../../core/services/shortcut.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, SharedProjectList, SharedProjectDetails],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {
  private db = inject(DatabaseService);
  appState = inject(AppStateService);
  private shortcutService = inject(ShortcutService);

  // Roh-Daten von Dexie
  rawProjects = toSignal(
    liveQuery(() => this.db.projects.orderBy('createdAt').reverse().toArray()), 
    { initialValue: [] as ProjectEntity[] }
  );
  
  // Mapping für die Shared-Komponente
  projectsList = computed(() => {
    const list = this.rawProjects() as ProjectEntity[];
    return list.map((p: ProjectEntity) => ({
      id: p.id,
      title: p.title,
      updatedAt: new Date(p.updatedAt).toLocaleDateString()
    } as ProjectListItem));
  });

  selectedProjectId: string | number | null = null;
  isResizing = false;
  private autoSelected = false;

  constructor() {
    effect(() => {
      const list = this.projectsList();
      if (list && list.length > 0 && !this.autoSelected) {
        setTimeout(() => {
          if (!this.selectedProjectId) {
            this.selectedProjectId = list[0].id;
            this.appState.trackPageVisit({
              id: list[0].id.toString(),
              type: 'Project',
              title: list[0].title,
              timestamp: Date.now()
            });
          }
        });
        this.autoSelected = true;
      }
    });
  }

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

  onProjectSelected(project: ProjectListItem) {
    this.selectedProjectId = project.id;
    this.appState.trackPageVisit({
      id: project.id.toString(),
      type: 'Project',
      title: project.title,
      timestamp: Date.now()
    });
  }

  get selectedProject(): ProjectDetailsItem | null {
    const list = this.rawProjects() as ProjectEntity[];
    const p = list.find((p: ProjectEntity) => p.id === this.selectedProjectId);
    if (!p) return null;
    return {
      id: p.id,
      title: p.title,
      updatedAt: p.updatedAt,
      description: `Status: ${p.status} | Priorität: ${p.priority}`
    };
  }

  async deleteProject(id: string | number) {
    if(this.selectedProjectId === id) this.selectedProjectId = null;
    await this.db.projects.delete(id.toString());
  }

  /**
   * Öffnet den Quick-Capture-Dialog für ein neues Projekt.
   */
  onAddProject() {
    this.shortcutService.toggleCaptureDialog('project');
  }
}
