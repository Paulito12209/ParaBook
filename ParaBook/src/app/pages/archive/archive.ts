import { Component } from '@angular/core';
import { SharedProjectList, ProjectListItem } from '../../shared/components/project-list/project-list';
import { SharedProjectDetails, ProjectDetailsItem } from '../../shared/components/project-details/project-details';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule, SharedProjectList, SharedProjectDetails],
  templateUrl: './archive.html',
  styleUrl: './archive.scss',
})
export class Archive {
  selectedProject: ProjectDetailsItem | null = null;

  onProjectSelected(project: ProjectListItem) {
    this.selectedProject = project as ProjectDetailsItem;
  }
}
