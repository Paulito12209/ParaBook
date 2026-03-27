import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskEntity } from '../../../../core/models/entities';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-details.html',
  styleUrl: './task-details.scss',
})
export class TaskDetailsComponent {
  @Input() task: TaskEntity | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();

  onClose() {
    this.close.emit();
  }

  onDelete() {
    if (this.task) {
      this.delete.emit(this.task.id);
    }
  }
}
