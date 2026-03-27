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
  selectedType: 'task' | 'project' | 'area' | 'resource' | null = null;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        setTimeout(() => this.captureInput?.nativeElement?.focus(), 50);
      }
    });
  }

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

  setType(type: 'task' | 'project' | 'area' | 'resource') {
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
        participants: [], isArchived: false, createdAt: now, updatedAt: now,
        taskIds: [], resourceIds: [], areaIds: [], meetingIds: [], bookmarkIds: []
      });
    } else if (type === 'resource') {
      // Hier würde die Logik für Ressourcen / Lesezeichen hinkommen
      console.log('Ressource gespeichert:', this.content);
    }

    this.close();
  }
}
