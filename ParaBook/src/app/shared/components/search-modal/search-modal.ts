import { Component, inject, ElementRef, ViewChild, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShortcutService } from '../../../core/services/shortcut.service';
import { DatabaseService } from '../../../core/database/db.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-modal.html',
  styleUrl: './search-modal.scss'
})
export class SearchModal {
  shortcutService = inject(ShortcutService);
  private db = inject(DatabaseService);
  private router = inject(Router);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  
  isOpen = this.shortcutService.isSearchModalOpen;
  searchQuery = '';
  
  // Mock-Ergebnisse für den Anfang, später echte DB-Suche
  results = signal<any[]>([]);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        setTimeout(() => this.searchInput?.nativeElement?.focus(), 50);
      }
    });
  }

  close() {
    this.shortcutService.closeAll();
    this.searchQuery = '';
    this.results.set([]);
  }

  onSearch() {
    // Hier wird später die echte Suche implementiert
    // Für das UI-Feedback zeigen wir ein paar Mock-Daten
    if (this.searchQuery.length > 2) {
      this.results.set([
        { id: '1', title: 'Meine SVG Sammlung', type: 'Ressource', path: 'System / ... / Ressourcen' },
        { id: '2', title: 'Raycast meeting', type: 'Termin', path: 'System / ... / Termine' },
        { id: '3', title: 'Struktur & Konzept', type: 'Ressource', path: 'PARA-Book' }
      ]);
    } else {
      this.results.set([]);
    }
  }

  navigate(result: any) {
    // Navigation Logik
    this.close();
  }
}
