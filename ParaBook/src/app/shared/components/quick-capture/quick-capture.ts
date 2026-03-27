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
  isAutoDetectedUrl = false;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        const preType = this.shortcutService.captureType();
        if (preType) this.selectedType = preType;
        this.isAutoDetectedUrl = false; // Zurücksetzen beim Öffnen
        setTimeout(() => this.captureInput?.nativeElement?.focus(), 50);
      }
    });
  }

  /**
   * Prüft, ob der Text eine valide URL ist (muss Protokoll oder www. enthalten).
   */
  isUrl(text: string): boolean {
    if (!text) return false;
    const trimmed = text.trim();
    // Einfachere, aber sicherere Prüfung für den User-Case
    const hasProtocol = /^https?:\/\//i.test(trimmed);
    const hasWww = /^www\./i.test(trimmed);
    const hasDomainPattern = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(trimmed);
    
    return hasProtocol || hasWww || (trimmed.includes('.') && hasDomainPattern);
  }

  onInput() {
    if (this.content.length > 0 && this.isUrl(this.content)) {
      this.selectedType = 'resource';
      this.isAutoDetectedUrl = true;
    } else if (this.content.length > 0 && !this.selectedType) {
      this.isAutoDetectedUrl = false;
      // Zeige Pillen an, wenn Text da ist aber noch kein Typ gewählt
    } else if (this.content.length === 0) {
      this.selectedType = null;
      this.isAutoDetectedUrl = false;
    } else {
      this.isAutoDetectedUrl = false;
    }
  }

  setType(type: 'task' | 'project' | 'area' | 'resource' | 'meeting') {
    this.selectedType = type;
    this.isAutoDetectedUrl = false; // Manuelle Wahl deaktiviert Auto-Hinweis
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
    } else if (type === 'area') {
      await this.db.areas.add({
        id, title: this.content.trim(), description: '',
        participants: [], isArchived: false, createdAt: now, updatedAt: now,
        projectIds: [], taskIds: [], resourceIds: [], meetingIds: [], bookmarkIds: []
      });
    } else if (type === 'resource') {
      let url = this.content.trim();
      // Automatische Protokoll-Ergänzung, falls nur Domain eingegeben wurde
      if (!url.toLowerCase().startsWith('http')) {
        url = 'https://' + url;
      }

      await this.db.resources.add({
        id, title: this.content.trim(), type: 'Lesezeichen', status: 'zu prüfen',
        url: url, isFavorite: false, isArchived: false, isHidden: false,
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
