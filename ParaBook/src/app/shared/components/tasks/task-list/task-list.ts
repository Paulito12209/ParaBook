import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskEntity } from '../../../../core/models/entities';
import { AppStateService } from '../../../../core/services/app-state.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskListComponent {
  @Input() tasks: TaskEntity[] = [];
  @Input() selectedTaskId: string | null = null;
  @Output() taskSelected = new EventEmitter<TaskEntity>();
  @Output() addTask = new EventEmitter<void>();
  @Output() toggleStatus = new EventEmitter<TaskEntity>();

  appState = inject(AppStateService);

  selectTask(task: TaskEntity) {
    this.selectedTaskId = task.id;
    this.taskSelected.emit(task);
  }

  onToggle(event: MouseEvent, task: TaskEntity) {
    event.stopPropagation();
    this.toggleStatus.emit(task);
  }

  onAdd() {
    this.addTask.emit();
  }
}
