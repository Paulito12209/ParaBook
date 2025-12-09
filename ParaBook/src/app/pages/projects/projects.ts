import { Component } from '@angular/core';
import { ProjectList } from './components/project-list/project-list';
import { ProjectDetails } from './components/project-details/project-details';

interface Project {
  id: number;
  title: string;
  updatedAt: string;
}

@Component({
  selector: 'app-projects',
  imports: [ProjectList, ProjectDetails],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  selectedProject: Project | null = null;
  mobileShowDetails = false;
  private isFirstLoad = true;

  onProjectSelected(project: Project) {
    this.selectedProject = project;

    // On first load (auto-select), we state on the list view for mobile
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      return;
    }

    this.mobileShowDetails = true;
  }

  onBackToProjectList() {
    this.mobileShowDetails = false;
  }
}
