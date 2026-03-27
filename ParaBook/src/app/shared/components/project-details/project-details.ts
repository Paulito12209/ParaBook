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
  /** Bestimmt, welche DB-Tabelle für Löschen/Archivieren genutzt wird */
  @Input() entityType: 'project' | 'area' = 'project';
  @Output() backToProjectList = new EventEmitter<void>();

  private db = inject(DatabaseService);

  /** Gibt die korrekte DB-Tabelle zurück */
  private get table() {
    return this.entityType === 'area' ? this.db.areas : this.db.projects;
  }

  goBack() {
    this.backToProjectList.emit();
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
}
