import { Component } from '@angular/core';
import { ProjectList } from './components/project-list/project-list';
import { ProjectDetails } from './components/project-details/project-details';

interface Project {
  id: number;
  title: string;
  updatedAt: string;
}

@Component({
  selector: 'app-archive',
  imports: [ProjectList, ProjectDetails],
  templateUrl: './archive.html',
  styleUrl: './archive.scss',
})
export class Archive {
  selectedProject: Project | null = null;

  onProjectSelected(project: Project) {
    this.selectedProject = project;
  }
}
