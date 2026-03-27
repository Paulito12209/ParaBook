import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProjectDetailsItem {
  id: string | number;
  title: string;
  updatedAt: string | number;
  description?: string;
}

@Component({
  selector: 'app-shared-project-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
})
export class SharedProjectDetails {
  @Input() project: ProjectDetailsItem | null = null;
  @Output() backToProjectList = new EventEmitter<void>();

  goBack() {
    this.backToProjectList.emit();
  }
}
