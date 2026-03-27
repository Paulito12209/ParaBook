import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShortcutService {
  isCaptureDialogOpen = signal(false);
  captureType = signal<'task' | 'project' | 'area' | 'resource' | 'meeting' | null>(null);
  isSearchModalOpen = signal(false);

  constructor() {
    this.initGlobalShortcuts();
  }

  /**
   * Öffnet oder schließt den Quick-Capture-Dialog mit einer optionalen Vorselektion.
   */
  toggleCaptureDialog(type: 'task' | 'project' | 'area' | 'resource' | 'meeting' | null = null) {
    if (type) {
        // Falls ein Typ übergeben wird, wollen wir den Dialog explizit öffnen (nicht nur toggen)
        this.captureType.set(type);
        this.isCaptureDialogOpen.set(true);
    } else {
        // Ohne Typ verhält es sich wie ein Toggle
        this.isCaptureDialogOpen.update(val => !val);
        if (!this.isCaptureDialogOpen()) {
            this.captureType.set(null);
        }
    }
    
    if (this.isCaptureDialogOpen()) this.isSearchModalOpen.set(false);
  }

  toggleSearchModal() {
    this.isSearchModalOpen.update(val => !val);
    if (this.isSearchModalOpen()) this.isCaptureDialogOpen.set(false);
  }

  closeAll() {
    this.isCaptureDialogOpen.set(false);
    this.isSearchModalOpen.set(false);
  }

  private initGlobalShortcuts() {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // ⌘F oder Ctrl+F für Suche
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        this.toggleSearchModal();
      }
      
      // ⌘N oder Ctrl+N für Quick Capture (New Entry)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        this.toggleCaptureDialog();
      }
      
      // Escape schließt beide
      if (e.key === 'Escape') {
        if (this.isCaptureDialogOpen() || this.isSearchModalOpen()) {
          e.preventDefault();
          this.closeAll();
        }
      }
    });
  }
}
