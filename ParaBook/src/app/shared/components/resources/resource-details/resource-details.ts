import { Component, Input, EventEmitter, Output, inject, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResourceEntity, ResourceType, StatusResource, TaskEntity } from '../../../../core/models/entities';
import { DatabaseService } from '../../../../core/database/db.service';
import { TaskLinkPanelComponent } from '../../tasks/task-link-panel/task-link-panel';
import { toSignal } from '@angular/core/rxjs-interop';
import { liveQuery } from 'dexie';

@Component({
  selector: 'app-resource-details',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskLinkPanelComponent],
  templateUrl: './resource-details.html',
  styleUrl: './resource-details.scss',
})
export class ResourceDetailsComponent {
  @Input() resource: ResourceEntity | null = null;
  @Output() close = new EventEmitter<void>();

  private db = inject(DatabaseService);

  isTaskPanelOpen = false;

  /** Lädt die verknüpften Aufgaben live für den Header-Indikator */
  linkedTasks: Signal<TaskEntity[]> = toSignal(
    liveQuery(() => {
      if (!this.resource) return Promise.resolve([] as TaskEntity[]);
      return this.db.tasks
        .where('resourceIds')
        .equals(this.resource.id)
        .toArray();
    }),
    { initialValue: [] as TaskEntity[] }
  );

  typeOptions: ResourceType[] = ['Lesezeichen', 'Notiz', 'SOP', 'Dokumentation', 'Ressource'];
  statusOptions: StatusResource[] = ['zu prüfen', 'in Prüfung', 'überprüft'];

  /** Steuert die Sichtbarkeit des URL-Bearbeitungsfelds */
  isEditingUrl = false;

  /**
   * Prüft, ob der Titel eine gültige URL enthält – nur dann wird "Link öffnen" angezeigt.
   */
  hasValidUrl(): boolean {
    if (!this.resource?.url) return false;
    const url = this.resource.url.trim();
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('www.');
  }

  toggleUrlEdit() {
    this.isEditingUrl = !this.isEditingUrl;
  }

  async updateResource() {
    if (!this.resource) return;
    
    await this.db.resources.update(this.resource.id, {
      title: this.resource.title,
      type: this.resource.type,
      status: this.resource.status,
      url: this.resource.url,
      description: this.resource.description,
      updatedAt: Date.now()
    });
  }

  /**
   * Archiviert die aktuelle Ressource.
   */
  async archiveResource() {
    if (!this.resource) return;
    await this.db.resources.update(this.resource.id, {
      isArchived: true,
      updatedAt: Date.now()
    });
    this.resource.isArchived = true;
    this.onClose();
  }

  /**
   * Löscht die aktuelle Ressource permanent.
   */
  async deleteResource() {
    if (!this.resource) return;
    await this.db.resources.delete(this.resource.id);
    this.onClose();
  }

  onClose() {
    this.isEditingUrl = false;
    this.isTaskPanelOpen = false;
    this.close.emit();
  }

  toggleTaskPanel() {
    this.isTaskPanelOpen = !this.isTaskPanelOpen;
  }
}
