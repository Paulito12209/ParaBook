import { Component, inject } from '@angular/core';
import { AppStateService } from '../../core/services/app-state.service';
import { RecentItemsComponent } from '../../shared/components/widgets/recent-items/recent-items';
import { TasksWidgetComponent } from '../../shared/components/widgets/tasks-widget/tasks-widget';
import { MeetingsWidgetComponent } from '../../shared/components/widgets/meetings-widget/meetings-widget';
import { ProjectsSliderComponent } from '../../shared/components/widgets/projects-slider/projects-slider';
import { ResourcesMatrixComponent } from '../../shared/components/widgets/resources-matrix/resources-matrix';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RecentItemsComponent,
    TasksWidgetComponent,
    MeetingsWidgetComponent,
    ProjectsSliderComponent,
    ResourcesMatrixComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private appState = inject(AppStateService);
  userDisplayName = this.appState.userDisplayName;

  constructor() {
    // Initialisiere Test-Zustand für die Demo
    if (!this.appState.favoriteProjectId()) {
        this.appState.setFavoriteProject('proj-1');
    }
    if (!this.appState.lastActiveWorkspaceId()) {
        this.appState.updateActiveWorkspace('area-2');
    }

    // Simuliere einen Besuch, falls Liste leer
    if (this.appState.lastVisitedPages().length === 0) {
        this.appState.trackPageVisit({
            id: 'proj-2',
            type: 'Project',
            title: 'ParaBook Redesign',
            timestamp: Date.now() - 3600000, // vor 1h
            icon: '🎨'
        });
    }
  }
}
