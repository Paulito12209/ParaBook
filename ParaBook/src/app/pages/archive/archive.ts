import { Component, inject, HostListener } from '@angular/core';
import { SharedProjectList, ProjectListItem } from '../../shared/components/project-list/project-list';
import { SharedProjectDetails, ProjectDetailsItem } from '../../shared/components/project-details/project-details';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../core/services/app-state.service';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule, SharedProjectList, SharedProjectDetails],
  templateUrl: './archive.html',
  styleUrl: './archive.scss',
})
export class Archive {
  appState = inject(AppStateService);
  selectedProject: ProjectDetailsItem | null = null;
  selectedProjectId: string | number | null = null;
  
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
    this.selectedProjectId = project.id;
    this.selectedProject = project as ProjectDetailsItem;
  }
}
