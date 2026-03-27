import { Component } from '@angular/core';
import { SharedProjectList, ProjectListItem } from '../../shared/components/project-list/project-list';
import { SharedProjectDetails, ProjectDetailsItem } from '../../shared/components/project-details/project-details';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, SharedProjectList, SharedProjectDetails],
  templateUrl: './resources.html',
  styleUrl: './resources.scss',
})
export class Resources {
  selectedProject: ProjectDetailsItem | null = null;

  onProjectSelected(project: ProjectListItem) {
    // Map ProjectListItem to ProjectDetailsItem if needed, or cast if they are compatible
    this.selectedProject = project as ProjectDetailsItem;
  }
}
