import { Component } from '@angular/core';
import { ProjectList } from './components/project-list/project-list';
import { ProjectDetails } from './components/project-details/project-details';

interface Project {
  id: number;
  title: string;
  updatedAt: string;
}

@Component({
  selector: 'app-areas',
  imports: [ProjectList, ProjectDetails],
  templateUrl: './areas.html',
  styleUrl: './areas.scss',
})
export class Areas {
  selectedProject: Project | null = null;

  onProjectSelected(project: Project) {
    this.selectedProject = project;
  }
}
