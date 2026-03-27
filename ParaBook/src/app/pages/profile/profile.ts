import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStateService } from '../../core/services/app-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  appState = inject(AppStateService);
  private router = inject(Router);

  tempName = signal(this.appState.userName());
  tempPhoto = signal(this.appState.userPhoto());

  onPhotoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempPhoto.set(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  save() {
    this.appState.userName.set(this.tempName());
    this.appState.userPhoto.set(this.tempPhoto());
    this.router.navigate(['/']); // Zurück zum HQ
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
