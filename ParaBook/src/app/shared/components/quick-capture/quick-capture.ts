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

  @ViewChild('captureInput') captureInput!: ElementRef<HTMLInputElement>;
  
  isOpen = this.shortcutService.isCaptureDialogOpen;
  content = '';
  selectedType: 'task' | 'project' | 'area' | 'resource' | 'meeting' | null = null;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        const preType = this.shortcutService.captureType();
        if (preType) this.selectedType = preType;
        setTimeout(() => this.captureInput?.nativeElement?.focus(), 50);
      }
    });
  }

  /**
   * Prüft, ob der Text eine URL ist.
   */
  isUrl(text: string): boolean {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d%_.~+=-]*)?$','i'); // fragment locator
    return !!pattern.test(text);
  }

  onInput() {
    if (this.isUrl(this.content)) {
      this.selectedType = 'resource';
    } else if (this.content.length > 0 && !this.selectedType) {
      // Zeige Pillen an, wenn Text da ist aber noch kein Typ gewählt
    }
  }

  setType(type: 'task' | 'project' | 'area' | 'resource' | 'meeting') {
    this.selectedType = type;
  }

  close() {
    this.shortcutService.closeAll();
    this.resetForm();
  }

  resetForm() {
    this.content = '';
    this.selectedType = null;
  }

  /**
   * Speichert den neuen Eintrag in der Datenbank.
   */
  async save() {
    if (!this.content.trim()) return;
    const type = this.selectedType || 'task'; // Default auf Task wenn nichts gewählt

    const id = crypto.randomUUID();
    const now = Date.now();

    if (type === 'task') {
      await this.db.tasks.add({
        id, title: this.content.trim(), status: 'offen', priority: 'mittel',
        type: 'aktiv', createdAt: now, updatedAt: now,
        details: '', resourceIds: [], meetingIds: [], sopIds: [], noteIds: []
      });
    } else if (type === 'project') {
      await this.db.projects.add({
        id, title: this.content.trim(), status: 'geplant', priority: 'mittel',
        participants: [], isArchived: false, isFavorite: false, createdAt: now, updatedAt: now,
        taskIds: [], resourceIds: [], areaIds: [], meetingIds: [], bookmarkIds: []
      });
    } else if (type === 'resource') {
      await this.db.resources.add({
        id, title: this.content.trim(), type: 'Lesezeichen', status: 'zu prüfen',
        url: this.content.trim(), isFavorite: false, isArchived: false, isHidden: false,
        assignee: 'Paul', participants: [],
        categories: [], targetGroups: [], createdAt: now, updatedAt: now,
        areaIds: [], projectIds: [], taskIds: [], meetingIds: []
      });
    } else if (type === 'meeting') {
      await this.db.meetings.add({
        id, 
        title: this.content.trim(), 
        scheduledFor: now, // Nutzt den aktuellen Zeitstempel
        status: 'geplant',
        topics: [],
        location: 'Noch nicht festgelegt', 
        participants: [], 
        isArchived: false,
        createdAt: now, 
        updatedAt: now,
        taskIds: [], 
        resourceIds: [], 
        projectIds: [], 
        areaIds: []
      });
    }

    this.close();
  }
}
