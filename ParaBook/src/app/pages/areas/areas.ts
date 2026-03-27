import { Component, inject, HostListener } from '@angular/core';
import { SharedProjectList, ProjectListItem } from '../../shared/components/project-list/project-list';
import { SharedProjectDetails, ProjectDetailsItem } from '../../shared/components/project-details/project-details';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../core/services/app-state.service';
import { DatabaseService } from '../../core/database/db.service';

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [CommonModule, SharedProjectList, SharedProjectDetails],
  templateUrl: './areas.html',
  styleUrl: './areas.scss',
})
export class Areas {
  private db = inject(DatabaseService);
  appState = inject(AppStateService);
  selectedProject: ProjectDetailsItem | null = null;
  selectedAreaId: string | number | null = null;
  
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

  onProjectSelected(project: ProjectListItem) {
    this.selectedAreaId = project.id;
    this.selectedProject = project as ProjectDetailsItem;
  }

  onAddItem() {
    const newId = crypto.randomUUID();
    this.db.areas.add({
        id: newId,
        title: 'Neuer Arbeitsbereich',
        description: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isArchived: false,
        projectIds: [],
        taskIds: [],
        resourceIds: [],
        meetingIds: [],
        bookmarkIds: [],
        participants: []
    });
  }
}
