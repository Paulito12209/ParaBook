import { Component } from '@angular/core';
import { SharedProjectList, ProjectListItem } from '../../shared/components/project-list/project-list';
import { SharedProjectDetails, ProjectDetailsItem } from '../../shared/components/project-details/project-details';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-areas',
    standalone: true,
    imports: [CommonModule, SharedProjectList, SharedProjectDetails],
    templateUrl: './areas.html',
    styleUrl: './areas.scss',
})
export class Areas {
    selectedProject: ProjectDetailsItem | null = null;

    onProjectSelected(project: ProjectListItem) {
        this.selectedProject = project as ProjectDetailsItem;
    }
}
