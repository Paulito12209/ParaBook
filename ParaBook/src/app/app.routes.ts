import { Routes } from '@angular/router';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Meetings } from './pages/meetings/meetings';
import { Tasks } from './pages/tasks/tasks';
import { Projects } from './pages/projects/projects';
import { Resources } from './pages/resources/resources';
import { Areas } from './pages/areas/areas';
import { Archive } from './pages/archive/archive';
import { System } from './pages/system/system';

export const routes: Routes = [
    {
        path: "", component: MainLayout, children: [
            { path: "dashboard", component: Dashboard },
            { path: "meetings", component: Meetings },
            { path: "tasks", component: Tasks },
            { path: "projects", component: Projects },
            { path: "areas", component: Areas },
            { path: "resources", component: Resources },
            { path: "archive", component: Archive },
            { path: "system", component: System },
            { path: "", redirectTo: "dashboard", pathMatch: "full" }
        ]
    }
];
