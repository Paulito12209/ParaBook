import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Project {
  id: number;
  title: string;
  updatedAt: string;
}

@Component({
  selector: 'app-project-list',
  imports: [FormsModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectList {
  @Output() projectSelected = new EventEmitter<Project>();

  searchQuery = '';
  selectedProject: Project | null = null;

  projects: Project[] = [
    { id: 1, title: 'Software Development: Web App', updatedAt: '2 hours ago' },
    { id: 2, title: 'Software Development: Mobile App', updatedAt: '1 day ago' },
    { id: 3, title: 'API Integration Project', updatedAt: '3 days ago' },
    { id: 4, title: 'Database Migration', updatedAt: '1 week ago' },
  ];

  filteredProjects: Project[] = [...this.projects];

  ngOnInit() {
    // Select first project by default
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

  selectProject(project: Project) {
    this.selectedProject = project;
    this.projectSelected.emit(project);
  }
}
