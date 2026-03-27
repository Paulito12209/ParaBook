import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskEntity } from '../../../../core/models/entities';
import { DatabaseService } from '../../../../core/database/db.service';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-details.html',
  styleUrl: './task-details.scss',
})
export class TaskDetailsComponent {
  @Input() task: TaskEntity | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();

  showPropertiesDialog = false;

  private db = inject(DatabaseService);

  onClose() {
    this.close.emit();
  }

  /**
   * Archiviert die Aufgabe durch Ändern des Typs auf 'archiviert'.
   */
  async onArchive() {
    if (!this.task) return;
    
    await this.db.tasks.update(this.task.id, {
      type: 'archiviert',
      updatedAt: Date.now()
    });
    
    this.onClose();
  }

  onDelete() {
    if (this.task) {
      this.delete.emit(this.task.id);
    }
  }

  /** Aktualisiert den Titel in der Datenbank */
  async updateTask() {
    if (!this.task) return;
    await this.db.tasks.update(this.task.id, {
      title: this.task.title,
      updatedAt: Date.now()
    });
  }

  /* --- Due Date Handler --- */
  formatDate(timestamp?: number): string {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  async updateDueDate(dateString: string) {
    if (!this.task) return;
    const timestamp = dateString ? new Date(dateString).getTime() : undefined;
    this.task.dueDate = timestamp;
    await this.db.tasks.update(this.task.id, {
      dueDate: timestamp,
      updatedAt: Date.now()
    });
  }

  /* --- Subtasks Handler --- */
  async updateSubtasks() {
    if (!this.task) return;
    await this.db.tasks.update(this.task.id, {
      subtasks: this.task.subtasks,
      updatedAt: Date.now()
    });
  }

  async addSubtask(title: string) {
    if (!title.trim() || !this.task) return;
    if (!this.task.subtasks) this.task.subtasks = [];
    
    this.task.subtasks.push({
      id: crypto.randomUUID(),
      title: title.trim(),
      isCompleted: false
    });
    await this.updateSubtasks();
  }

  async removeSubtask(id: string) {
    if (!this.task || !this.task.subtasks) return;
    this.task.subtasks = this.task.subtasks.filter(st => st.id !== id);
    await this.updateSubtasks();
  }

  togglePropertiesDialog() {
    this.showPropertiesDialog = !this.showPropertiesDialog;
  }
}
