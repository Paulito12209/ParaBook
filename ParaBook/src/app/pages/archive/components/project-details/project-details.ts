import { Component, Input } from '@angular/core';

interface Project {
  id: number;
  title: string;
  updatedAt: string;
}

@Component({
  selector: 'app-project-details',
  imports: [],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
})
export class ProjectDetails {
  @Input() project: Project | null = null;
}
