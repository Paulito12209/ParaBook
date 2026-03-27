import { Component, Input, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResourceEntity, ResourceType, StatusResource } from '../../../../core/models/entities';
import { DatabaseService } from '../../../../core/database/db.service';

@Component({
  selector: 'app-resource-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resource-details.html',
  styleUrl: './resource-details.scss',
})
export class ResourceDetailsComponent {
  @Input() resource: ResourceEntity | null = null;
  @Output() close = new EventEmitter<void>();

  private db = inject(DatabaseService);

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
    this.close.emit();
  }
}
