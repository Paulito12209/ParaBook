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

  appState = inject(AppStateService);

  searchQuery = '';
  selectedCategoryId: ResourceType | 'Alle' = 'Alle';
  selectedResourceId: string | null = null;

  categories: (ResourceType | 'Alle')[] = ['Alle', 'SOP', 'Notiz', 'Lesezeichen', 'Dokumentation', 'Ressource'];

  get filteredResources(): ResourceEntity[] {
    const query = this.searchQuery.toLowerCase();
    const assigneeFilter = this.appState.globalAssigneeFilter();

    return this.resources.filter(res => {
      const matchesSearch = res.title.toLowerCase().includes(query);
      const matchesCategory = this.selectedCategoryId === 'Alle' || res.type === this.selectedCategoryId;
      const matchesAssignee = assigneeFilter === 'Alle' || res.assignee === assigneeFilter;
      
      return matchesSearch && matchesCategory && matchesAssignee;
    });
  }

  selectCategory(cat: ResourceType | 'Alle') {
    this.selectedCategoryId = cat;
  }

  selectResource(res: ResourceEntity) {
    this.selectedResourceId = res.id;
    this.resourceSelected.emit(res);
  }
}
