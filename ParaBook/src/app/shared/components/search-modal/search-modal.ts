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

  async onSearch() {
    if (this.searchQuery.length < 2) {
      this.results.set([]);
      return;
    }

    const query = this.searchQuery.toLowerCase();
    
    // Suche in Projekten, Ressourcen und Aufgaben
    const [projects, resources, tasks, areas] = await Promise.all([
      this.db.projects.filter(p => p.title.toLowerCase().includes(query)).limit(5).toArray(),
      this.db.resources.filter(r => r.title.toLowerCase().includes(query)).limit(5).toArray(),
      this.db.tasks.filter(t => t.title.toLowerCase().includes(query)).limit(5).toArray(),
      this.db.areas.filter(a => a.title.toLowerCase().includes(query)).limit(5).toArray()
    ]);

    const mappedResults = [
      ...projects.map(p => ({ id: p.id, title: p.title, type: 'Projekt', path: 'PARA / Projekte', icon: '📁' })),
      ...areas.map(a => ({ id: a.id, title: a.title, type: 'Bereich', path: 'PARA / Bereiche', icon: '⭕' })),
      ...resources.map(r => ({ id: r.id, title: r.title, type: 'Ressource', path: 'PARA / Ressourcen', icon: '📄' })),
      ...tasks.map(t => ({ id: t.id, title: t.title, type: 'Aufgabe', path: 'System / Aufgaben', icon: '🎯' }))
    ];

    this.results.set(mappedResults);
  }

  navigate(result: any) {
    let route = '/';
    switch (result.type) {
      case 'Projekt': route = '/projects'; break;
      case 'Bereich': route = '/areas'; break;
      case 'Ressource': route = '/resources'; break;
      case 'Aufgabe': route = '/tasks'; break;
    }
    
    // Wir navigieren zur Seite und übergeben die ID als QueryParam für die Auswahl
    this.router.navigate([route], { queryParams: { id: result.id } });
    this.close();
  }
}
