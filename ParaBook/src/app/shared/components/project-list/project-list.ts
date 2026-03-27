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
  @Output() projectSelected = new EventEmitter<ProjectListItem>();

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
      project.title.toLowerCase().includes(query)
    );
  }

  addProject() {
    const newProject: ProjectListItem = {
      id: crypto.randomUUID(),
      title: `Neues Projekt`,
      updatedAt: Date.now()
    };

    this.projects.unshift(newProject);
    this.onSearch();
  }

  selectProject(project: ProjectListItem) {
    this.selectedProject = project;
    this.projectSelected.emit(project);
  }
}
