import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResourceEntity, ResourceType } from '../../../../core/models/entities';
import { AppStateService } from '../../../../core/services/app-state.service';

@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resource-list.html',
  styleUrl: './resource-list.scss',
})
export class ResourceListComponent {
  @Input() resources: ResourceEntity[] = [];
  @Output() resourceSelected = new EventEmitter<ResourceEntity>();
  @Output() addResource = new EventEmitter<void>();

  appState = inject(AppStateService);
  selectedResourceId: string | null = null;
  selectedCategoryId: string = 'Alle';

  categories = ['Alle', 'SOP', 'Notiz', 'Lesezeichen', 'Dokumentation', 'Ressource'];

  get filteredResources(): ResourceEntity[] {
    const roleFilter = this.appState.getPageRole('/resources');

    return this.resources.filter(res => {
      const matchesCategory = this.selectedCategoryId === 'Alle' || res.type === this.selectedCategoryId;
      
      let matchesRole = true;
      if (roleFilter === 'assignee') {
        matchesRole = res.assignee === 'Paul';
      } else if (roleFilter === 'participant') {
        matchesRole = res.participants.includes('Paul');
      }
      
      return matchesCategory && matchesRole;
    });
  }

  selectCategory(cat: string) {
    this.selectedCategoryId = cat;
  }

  selectResource(res: ResourceEntity) {
    this.selectedResourceId = res.id;
    this.resourceSelected.emit(res);
  }

  onAddResource() {
    this.addResource.emit();
  }
}
