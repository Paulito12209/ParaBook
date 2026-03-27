import { Component, inject, ElementRef, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShortcutService } from '../../../core/services/shortcut.service';
import { DatabaseService } from '../../../core/database/db.service';
import { TaskEntity, ProjectEntity } from '../../../core/models/entities';

@Component({
  selector: 'app-quick-capture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quick-capture.html',
  styleUrl: './quick-capture.scss'
})
export class QuickCapture {
  shortcutService = inject(ShortcutService);
  private db = inject(DatabaseService);

  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;
  
  isOpen = this.shortcutService.isCaptureDialogOpen;

  captureType: 'task' | 'project' = 'task';
  title = '';
  details = '';
  showDetails = false;

  constructor() {
    // Fokus auf das Input-Feld, sobald sich der Dialog öffnet
    effect(() => {
      if (this.isOpen()) {
        setTimeout(() => this.titleInput?.nativeElement?.focus(), 50);
      }
    });
  }

  close() {
    this.shortcutService.closeCaptureDialog();
    this.resetForm();
  }

  resetForm() {
    this.title = '';
    this.details = '';
    this.showDetails = false;
    this.captureType = 'task';
  }

  async save() {
    if (!this.title.trim()) return;

    if (this.captureType === 'task') {
      const newTask: TaskEntity = {
        id: crypto.randomUUID(),
        title: this.title.trim(),
        details: this.details.trim(),
        status: 'offen',
        priority: 'mittel',
        type: 'aktiv',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        resourceIds: [], meetingIds: [], sopIds: [], noteIds: []
      };
      await this.db.tasks.add(newTask);
    } else if (this.captureType === 'project') {
      const newProject: ProjectEntity = {
        id: crypto.randomUUID(),
        title: this.title.trim(),
        status: 'geplant',
        priority: 'mittel',
        participants: [],
        isArchived: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        taskIds: [], resourceIds: [], areaIds: [], meetingIds: [], bookmarkIds: []
      };
      await this.db.projects.add(newProject);
    }

    this.close();
  }
}
