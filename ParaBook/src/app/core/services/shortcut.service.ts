import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShortcutService {
  isCaptureDialogOpen = signal(false);

  constructor() {
    this.initGlobalShortcuts();
  }

  toggleCaptureDialog() {
    this.isCaptureDialogOpen.update(val => !val);
  }

  closeCaptureDialog() {
    this.isCaptureDialogOpen.set(false);
  }

  private initGlobalShortcuts() {
    // Registriere globale Shortcuts für Cmd+K / Ctrl+K
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.toggleCaptureDialog();
      }
      
      // Escape schließt das Modal
      if (e.key === 'Escape' && this.isCaptureDialogOpen()) {
        e.preventDefault();
        this.closeCaptureDialog();
      }
    });
  }
}
