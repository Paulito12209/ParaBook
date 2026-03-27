import { Component, inject, signal, HostListener, ElementRef } from '@angular/core';
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
  public router = inject(Router);
  private route = inject(ActivatedRoute);
  private el = inject(ElementRef);

  private shortcutService = inject(ShortcutService);
  appState = inject(AppStateService);

  pageTitle = signal('');
  isAssigneeDropdownOpen = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isAssigneeDropdownOpen = false;
    }
  }

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

  toggleAssigneeDropdown(event: Event) {
    event.stopPropagation();
    this.isAssigneeDropdownOpen = !this.isAssigneeDropdownOpen;
  }

  getCurrentRole(): string {
    const role = this.appState.getPageRole(this.router.url);
    if (role === 'all') return 'Ohne Filter';
    if (role === 'assignee') return 'Verantwortliche/r';
    return 'Teilnehmer/in';
  }

  selectRole(role: 'all' | 'assignee' | 'participant', event: Event) {
    event.stopPropagation();
    this.appState.setPageRole(this.router.url, role);
    this.isAssigneeDropdownOpen = false;
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
