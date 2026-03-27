import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle';
import { ShortcutService } from '../../../core/services/shortcut.service';
import { AppStateService } from '../../../core/services/app-state.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private shortcutService = inject(ShortcutService);
  appState = inject(AppStateService);

  pageTitle = signal('');
  isAssigneeDropdownOpen = false;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      let currentRoute = this.route.root;
      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }
      const title = currentRoute.snapshot.data['title'] || 'Hauptquartier';
      this.pageTitle.set(title);
    });
  }

  openSearch() {
    this.shortcutService.toggleSearchModal();
  }

  toggleAssigneeDropdown() {
    this.isAssigneeDropdownOpen = !this.isAssigneeDropdownOpen;
  }

  selectAssignee(assignee: string, event: Event) {
    event.stopPropagation();
    this.appState.setGlobalAssignee(assignee);
    this.isAssigneeDropdownOpen = false;
  }
}
