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

  async updateResource() {
    if (!this.resource) return;
    
    await this.db.resources.update(this.resource.id, {
      title: this.resource.title,
      type: this.resource.type,
      status: this.resource.status,
      description: this.resource.description,
      updatedAt: Date.now()
    });
  }

  onClose() {
    this.close.emit();
  }
}
