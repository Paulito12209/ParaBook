import { Component, inject, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceListComponent } from '../../shared/components/resources/resource-list/resource-list';
import { ResourceDetailsComponent } from '../../shared/components/resources/resource-details/resource-details';
import { ResourceEntity } from '../../core/models/entities';
import { DatabaseService } from '../../core/database/db.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { AppStateService } from '../../core/services/app-state.service';
import { ShortcutService } from '../../core/services/shortcut.service';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, ResourceListComponent, ResourceDetailsComponent],
  templateUrl: './resources.html',
  styleUrl: './resources.scss',
})
export class Resources implements OnInit {
  private db = inject(DatabaseService);
  private mockData = inject(MockDataService);
  appState = inject(AppStateService);

  allResources = signal<ResourceEntity[]>([]);
  selectedResource = signal<ResourceEntity | null>(null);

  isResizing = false;

  private shortcutService = inject(ShortcutService);

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;
    
    // Minimal 400px
    const newWidth = Math.max(400, event.clientX);
    this.appState.setGlobalSidebarWidth(newWidth);
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isResizing = false;
    document.body.style.cursor = 'default';
  }

  startResizing(event: MouseEvent) {
    event.preventDefault();
    this.isResizing = true;
    document.body.style.cursor = 'col-resize';
  }

  /**
   * Öffnet den Quick-Capture-Dialog für eine neue Ressource.
   */
  onAddResource() {
    this.shortcutService.toggleCaptureDialog('resource');
  }

  async ngOnInit() {
    await this.loadResources();
  }

  async loadResources() {
    let resources = await this.db.resources.toArray();
    
    // Fallback auf Mock-Daten, falls DB leer ist (für die Demo)
    if (resources.length === 0) {
      const mocks = this.mockData.getResources();
      for (const m of mocks) {
        await this.db.resources.add(m);
      }
      resources = mocks;
    }
    
    this.allResources.set(resources);

    // Automatische Auswahl des ersten Elements beim Navigieren
    if (resources.length > 0 && !this.selectedResource()) {
      this.selectedResource.set(resources[0]);
    }
  }

  onResourceSelected(res: ResourceEntity) {
    this.selectedResource.set(res);
  }

  onCloseDetails() {
    this.selectedResource.set(null);
  }
}
