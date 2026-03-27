import { Component, inject, Signal, computed, HostListener } from '@angular/core';
import { liveQuery } from 'dexie';
import { toSignal } from '@angular/core/rxjs-interop';
import { SharedProjectList, ProjectListItem } from '../../shared/components/project-list/project-list';
import { SharedProjectDetails, ProjectDetailsItem } from '../../shared/components/project-details/project-details';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../core/services/app-state.service';
import { DatabaseService } from '../../core/database/db.service';
import { ShortcutService } from '../../core/services/shortcut.service';
import { AreaEntity } from '../../core/models/entities';

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
  private shortcutService = inject(ShortcutService);

  // Roh-Daten von Dexie
  rawAreas = toSignal(
    liveQuery(() => this.db.areas.orderBy('createdAt').reverse().toArray()), 
    { initialValue: [] as AreaEntity[] }
  );
  
  // Mapping für die Shared-Komponente
  areasList = computed(() => {
    const list = this.rawAreas() as AreaEntity[];
    return list.map((a: AreaEntity) => ({
      id: a.id,
      title: a.title,
      updatedAt: new Date(a.updatedAt).toLocaleDateString()
    } as ProjectListItem));
  });

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

  /**
   * Öffnet den Quick-Capture-Dialog für einen neuen Arbeitsbereich.
   */
  onAddArea() {
    this.shortcutService.toggleCaptureDialog('area');
  }
}
