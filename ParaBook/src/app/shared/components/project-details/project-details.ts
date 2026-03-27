import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../../core/database/db.service';

export interface ProjectDetailsItem {
  id: string | number;
  title: string;
  updatedAt: string | number;
  description?: string;
}

@Component({
  selector: 'app-shared-project-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
})
export class SharedProjectDetails {
  @Input() project: ProjectDetailsItem | null = null;
  @Output() backToProjectList = new EventEmitter<void>();

  private db = inject(DatabaseService);

  goBack() {
    this.backToProjectList.emit();
  }

  /**
   * Archiviert das aktuelle Projekt.
   */
  async archiveProject() {
    if (!this.project) return;
    
    // In der Datenbank als archiviert markieren
    await (this.db as any).projects.update(this.project.id, {
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
    await (this.db as any).projects.delete(this.project.id);

    // Zurück zur Liste
    this.goBack();
  }
}
