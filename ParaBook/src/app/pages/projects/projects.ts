import { Component, inject, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../core/database/db.service';
import { ProjectEntity } from '../../core/models/entities';
import { liveQuery } from 'dexie';
import { toSignal } from '@angular/core/rxjs-interop';
import { SharedProjectList, ProjectListItem } from '../../shared/components/project-list/project-list';
import { SharedProjectDetails, ProjectDetailsItem } from '../../shared/components/project-details/project-details';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedProjectList, SharedProjectDetails],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {
  private db = inject(DatabaseService);

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

  onProjectSelected(project: ProjectListItem) {
    this.selectedProjectId = project.id;
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

  // Die addProject Logik bleibt gleich, wird aber evtl. von der Shared-Komponente getriggert oder hier behalten
  // Für das Refactoring nutzen wir vorerst die Shared-Listen-Logik zum Anzeigen.
}
