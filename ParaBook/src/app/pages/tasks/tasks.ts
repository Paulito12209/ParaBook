import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../core/database/db.service';
import { TaskEntity } from '../../core/models/entities';
import { liveQuery } from 'dexie';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})
export class Tasks {
  private db = inject(DatabaseService);

  // Reaktives Signal aus der Dexie-Datenbank explizit typisieren
  tasks: Signal<TaskEntity[]> = toSignal(
    liveQuery(() => this.db.tasks.orderBy('createdAt').reverse().toArray()), 
    { initialValue: [] as TaskEntity[] }
  ) as Signal<TaskEntity[]>;

  // State für Quick Add Input
  newTaskTitle = '';

  async addTask() {
    if (!this.newTaskTitle.trim()) return;

    const newTask: TaskEntity = {
      id: crypto.randomUUID(),
      title: this.newTaskTitle.trim(),
      status: 'offen',
      priority: 'mittel',
      type: 'aktiv',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      resourceIds: [],
      meetingIds: [],
      sopIds: [],
      noteIds: []
    };

    await this.db.tasks.add(newTask);
    this.newTaskTitle = ''; // Reset Form nach Speichern
  }

  async toggleStatus(task: TaskEntity) {
    const newStatus = task.status === 'erledigt' ? 'offen' : 'erledigt';
    await this.db.tasks.update(task.id, { 
      status: newStatus, 
      updatedAt: Date.now() 
    });
  }

  async deleteTask(id: string) {
    await this.db.tasks.delete(id);
  }
}
