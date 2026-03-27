import { Injectable, signal, effect } from '@angular/core';

export interface VisitedPage {
  id: string;
  type: 'Project' | 'Resource' | 'Task' | 'Area' | 'Meeting';
  title: string;
  timestamp: number;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // Signals für den State
  lastVisitedPages = signal<VisitedPage[]>(this.loadFromStorage('lastVisitedPages', []));
  favoriteProjectId = signal<string | null>(this.loadFromStorage('favoriteProjectId', null));
  lastOpenedProjectId = signal<string | null>(this.loadFromStorage('lastOpenedProjectId', null));
  lastActiveWorkspaceId = signal<string | null>(this.loadFromStorage('lastActiveWorkspaceId', null));

  constructor() {
    // Effekte zur Persistierung im LocalStorage
    effect(() => {
      localStorage.setItem('parabook_lastVisitedPages', JSON.stringify(this.lastVisitedPages()));
    });
    effect(() => {
      localStorage.setItem('parabook_favoriteProjectId', JSON.stringify(this.favoriteProjectId()));
    });
    effect(() => {
      localStorage.setItem('parabook_lastOpenedProjectId', JSON.stringify(this.lastOpenedProjectId()));
    });
    effect(() => {
      localStorage.setItem('parabook_lastActiveWorkspaceId', JSON.stringify(this.lastActiveWorkspaceId()));
    });
  }

  // Hilfsmethoden zum Setzen des States
  trackPageVisit(page: VisitedPage) {
    this.lastVisitedPages.update(pages => {
      // Entferne Duplikate derselben ID
      const filtered = pages.filter(p => p.id !== page.id);
      // Füge neue Seite vorne an und limitiere auf 10
      return [page, ...filtered].slice(0, 10);
    });
    
    if (page.type === 'Project') {
      this.lastOpenedProjectId.set(page.id);
    }
  }

  setFavoriteProject(projectId: string | null) {
    this.favoriteProjectId.set(projectId);
  }

  updateActiveWorkspace(workspaceId: string) {
    this.lastActiveWorkspaceId.set(workspaceId);
  }

  private loadFromStorage<T>(key: string, defaultValue: T): T {
    const saved = localStorage.getItem(`parabook_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  }
}
