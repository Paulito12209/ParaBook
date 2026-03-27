import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ProjectListItem {
  id: string | number;
  title: string;
  updatedAt: string | number;
}

@Component({
  selector: 'app-shared-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class SharedProjectList implements OnInit {
  @Input() projects: ProjectListItem[] = [];
  @Input() searchPlaceholder: string = 'Search projects...';
  @Input() addButtonLabel: string = 'Add New Project';
  @Input() showSearch: boolean = true;
  /**
   * Steuert die Sichtbarkeit des "Add"-Buttons (im Archiv ausgeblendet).
   */
  @Input() showAddButton: boolean = true;
  @Output() projectSelected = new EventEmitter<ProjectListItem>();
  @Output() itemAdded = new EventEmitter<void>();

  searchQuery = '';
  selectedProject: ProjectListItem | null = null;
  filteredProjects: ProjectListItem[] = [];

  ngOnInit() {
    this.filteredProjects = [...this.projects];
    if (this.projects.length > 0) {
      this.selectProject(this.projects[0]);
    }
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredProjects = this.projects.filter(project =>
      project.title.toLowerCase()?.includes(query)
    );
  }

  addItem() {
    this.itemAdded.emit();
  }

  selectProject(project: ProjectListItem) {
    this.selectedProject = project;
    this.projectSelected.emit(project);
  }
}
