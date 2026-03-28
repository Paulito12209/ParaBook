import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../../core/database/db.service';
import { TaskLinkPanelComponent } from '../tasks/task-link-panel/task-link-panel';

export interface ProjectDetailsItem {
  id: string | number;
  title: string;
  updatedAt: string | number;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: number;
}

@Component({
  selector: 'app-shared-project-details',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskLinkPanelComponent],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
})
export class SharedProjectDetails {
  @Input() project: ProjectDetailsItem | null = null;
  /** Bestimmt, welche DB-Tabelle für Löschen/Archivieren genutzt wird */
  @Input() entityType: 'project' | 'area' = 'project';
  @Output() backToProjectList = new EventEmitter<void>();

  isTaskPanelOpen = false;

  private db = inject(DatabaseService);

  /** Gibt die korrekte DB-Tabelle zurück */
  private get table() {
    return this.entityType === 'area' ? this.db.areas : this.db.projects;
  }

  goBack() {
    this.backToProjectList.emit();
  }

  /** Aktualisiert den Titel in der Datenbank */
  async updateProject() {
    if (!this.project) return;
    await (this.table as any).update(this.project.id, {
      title: this.project.title,
      updatedAt: Date.now()
    });
  }

  formatDate(timestamp?: number): string {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  async updateDueDate(dateString: string) {
    if (!this.project) return;
    const timestamp = dateString ? new Date(dateString).getTime() : undefined;
    this.project.dueDate = timestamp;
    await (this.table as any).update(this.project.id, {
      dueDate: timestamp,
      updatedAt: Date.now()
    });
  }

  /**
   * Archiviert das aktuelle Projekt.
   */
  async archiveProject() {
    if (!this.project) return;
    
    // In der Datenbank als archiviert markieren
    await (this.table as any).update(this.project.id, {
      isArchived: true,
      updatedAt: Date.now()
    });
    
    // Zurück zur Liste navigieren
    this.goBack();
  }

  /**
   * Löscht das aktuelle Projekt permanent aus der Datenbank.
   */
  async deleteProject() {
    if (!this.project) return;

    // Projekt aus der Datenbank löschen
    await (this.table as any).delete(this.project.id);

    // Zurück zur Liste
    this.goBack();
  }

  /**
   * Öffnet das Side-Panel zur Aufgaben-Verknüpfung.
   */
  toggleTaskPanel() {
    this.isTaskPanelOpen = !this.isTaskPanelOpen;
  }
}
