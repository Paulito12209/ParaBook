import { Component } from '@angular/core';
import { ProjectList } from './components/project-list/project-list';
import { ProjectDetails } from './components/project-details/project-details';

interface Project {
  id: number;
  title: string;
  updatedAt: string;
}

@Component({
  selector: 'app-resources',
  imports: [ProjectList, ProjectDetails],
  templateUrl: './resources.html',
  styleUrl: './resources.scss',
})
export class Resources {
  selectedProject: Project | null = null;

  onProjectSelected(project: Project) {
    this.selectedProject = project;
  }
}
