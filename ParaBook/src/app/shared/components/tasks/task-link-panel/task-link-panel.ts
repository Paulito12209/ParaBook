import { Component, EventEmitter, Input, Output, inject, Signal, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../../../core/database/db.service';
import { TaskEntity } from '../../../../core/models/entities';
import { liveQuery } from 'dexie';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-link-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-link-panel.html',
  styleUrl: './task-link-panel.scss',
})
export class TaskLinkPanelComponent {
  @Input() parentId: string | number | null = null;
  @Input() parentType: 'project' | 'area' | 'resource' | 'meeting' = 'project';
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  private db = inject(DatabaseService);
  
  searchQuery = signal('');
  
  // Alle Aufgaben laden
  allTasks: Signal<TaskEntity[]> = toSignal(
    liveQuery(() => (this.db as any).tasks.toArray()),
    { initialValue: [] as TaskEntity[] }
  ) as Signal<TaskEntity[]>;

  // Gefilterte Aufgaben basierend auf Suche
  filteredTasks = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const tasks = this.allTasks();
    
    if (!query) return tasks.slice(0, 50); // Zeige erste 50 wenn leer
    
    return tasks.filter((t: TaskEntity) => 
      t.title.toLowerCase().includes(query) || 
      (t.details && t.details.toLowerCase().includes(query))
    );
  });

  onClose() {
    this.close.emit();
  }

  isLinked(task: TaskEntity): boolean {
    if (!this.parentId) return false;
    const pid = this.parentId.toString();
    
    switch (this.parentType) {
      case 'project': return task.projectId === pid;
      case 'area': return task.areaId === pid;
      case 'resource': return task.resourceIds?.includes(pid) ?? false;
      case 'meeting': return task.meetingIds?.includes(pid) ?? false;
      default: return false;
    }
  }

  async toggleLink(task: TaskEntity) {
    if (!this.parentId) return;
    const pid = this.parentId.toString();
    const linked = this.isLinked(task);

    const updateData: any = { updatedAt: Date.now() };

    if (this.parentType === 'project') {
      updateData.projectId = linked ? undefined : pid;
    } else if (this.parentType === 'area') {
      updateData.areaId = linked ? undefined : pid;
    } else if (this.parentType === 'resource') {
      let ids = task.resourceIds || [];
      updateData.resourceIds = linked ? ids.filter(id => id !== pid) : [...ids, pid];
    } else if (this.parentType === 'meeting') {
      let ids = task.meetingIds || [];
      updateData.meetingIds = linked ? ids.filter(id => id !== pid) : [...ids, pid];
    }

    await this.db.tasks.update(task.id, updateData);
  }

  async quickAddTask(title: string) {
    if (!title.trim() || !this.parentId) return;
    const pid = this.parentId.toString();

    const newTask: Partial<TaskEntity> = {
      id: crypto.randomUUID(),
      title: title.trim(),
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

    if (this.parentType === 'project') newTask.projectId = pid;
    if (this.parentType === 'area') newTask.areaId = pid;
    if (this.parentType === 'resource') newTask.resourceIds = [pid];
    if (this.parentType === 'meeting') newTask.meetingIds = [pid];

    await this.db.tasks.add(newTask as TaskEntity);
    this.searchQuery.set(''); // Reset Suche nach Add
  }
}
