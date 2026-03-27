import { Component, inject, signal } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle';
import { ShortcutService } from '../../../core/services/shortcut.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ThemeToggleComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private shortcutService = inject(ShortcutService);
  pageTitle = signal('');

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
}
