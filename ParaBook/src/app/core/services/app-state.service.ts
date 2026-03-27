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
  globalRoleFilter = signal<'all' | 'assignee' | 'participant'>(this.loadFromStorage('globalRoleFilter', 'assignee'));
  globalSidebarWidth = signal<number>(this.loadFromStorage('globalSidebarWidth', 400));
  userName = signal<string>(this.loadFromStorage('userName', 'Paul'));
  userPhoto = signal<string|null>(this.loadFromStorage('userPhoto', 'profile-icon.png'));

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
    effect(() => {
      localStorage.setItem('parabook_globalRoleFilter', JSON.stringify(this.globalRoleFilter()));
    });
    effect(() => {
      localStorage.setItem('parabook_globalSidebarWidth', JSON.stringify(this.globalSidebarWidth()));
    });
    effect(() => {
      localStorage.setItem('parabook_userName', JSON.stringify(this.userName()));
    });
    effect(() => {
      localStorage.setItem('parabook_userPhoto', JSON.stringify(this.userPhoto()));
    });
  }

  // Hilfsmethoden zum Setzen des States
  setGlobalRole(role: 'all' | 'assignee' | 'participant') {
      this.globalRoleFilter.set(role);
  }

  setGlobalSidebarWidth(width: number) {
      this.globalSidebarWidth.set(width);
  }

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
