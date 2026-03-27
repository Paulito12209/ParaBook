import { Component, inject, Signal, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../core/database/db.service';
import { TaskEntity } from '../../core/models/entities';
import { liveQuery } from 'dexie';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppStateService } from '../../core/services/app-state.service';
import { ShortcutService } from '../../core/services/shortcut.service';
import { TaskListComponent } from '../../shared/components/tasks/task-list/task-list';
import { TaskDetailsComponent } from '../../shared/components/tasks/task-details/task-details';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskListComponent, TaskDetailsComponent],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})
export class Tasks {
  private db = inject(DatabaseService);
  appState = inject(AppStateService);
  private shortcutService = inject(ShortcutService);

  tasks: Signal<TaskEntity[]> = toSignal(
    liveQuery(() => this.db.tasks.orderBy('createdAt').reverse().toArray()), 
    { initialValue: [] as TaskEntity[] }
  ) as Signal<TaskEntity[]>;

  selectedTask: TaskEntity | null = null;
  selectedTaskId: string | null = null;
  isResizing = false;
  private autoSelected = false;

  constructor() {
    effect(() => {
      const list = this.tasks();
      if (list && list.length > 0 && !this.autoSelected) {
        setTimeout(() => {
          if (!this.selectedTaskId) {
            this.selectedTaskId = list[0].id;
            this.selectedTask = list[0];
            this.appState.trackPageVisit({
              id: list[0].id!,
              type: 'Task',
              title: list[0].title,
              timestamp: Date.now()
            });
          }
        });
        this.autoSelected = true;
      }
    });
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;
    const newWidth = Math.max(400, event.clientX);
    this.appState.setGlobalSidebarWidth(newWidth);
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isResizing = false;
    document.body.style.cursor = 'default';
  }

  startResizing(event: MouseEvent) {
    event.preventDefault();
    this.isResizing = true;
    document.body.style.cursor = 'col-resize';
  }

  onTaskSelected(task: TaskEntity) {
    this.selectedTaskId = task.id;
    this.selectedTask = task;
    this.appState.trackPageVisit({
      id: task.id!,
      type: 'Task',
      title: task.title,
      timestamp: Date.now()
    });
  }

  onAddTask() {
    this.shortcutService.toggleCaptureDialog('task');
  }

  async onToggleStatus(task: TaskEntity) {
    const newStatus = task.status === 'erledigt' ? 'offen' : 'erledigt';
    await this.db.tasks.update(task.id, { 
      status: newStatus, 
      updatedAt: Date.now() 
    });
    // Update local selected task if needed
    if (this.selectedTaskId === task.id) {
        this.selectedTask = { ...task, status: newStatus };
    }
  }

  async onDeleteTask(id: string) {
    if (this.selectedTaskId === id) {
        this.selectedTaskId = null;
        this.selectedTask = null;
    }
    await this.db.tasks.delete(id);
  }
}

