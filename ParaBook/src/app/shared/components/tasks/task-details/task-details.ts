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
}
