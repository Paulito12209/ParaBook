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
            { path: "dashboard", component: Dashboard, data: { title: 'Hauptquartier' } },
            { path: "meetings", component: Meetings, data: { title: 'Meetings' } },
            { path: "tasks", component: Tasks, data: { title: 'Aufgaben' } },
            { path: "projects", component: Projects, data: { title: 'Projekte' } },
            { path: "areas", component: Areas, data: { title: 'Arbeitsbereiche' } },
            { path: "resources", component: Resources, data: { title: 'Ressourcen' } },
            { path: "archive", component: Archive, data: { title: 'Archiv' } },
            { path: "system", component: System, data: { title: 'System' } },
            { path: "", redirectTo: "dashboard", pathMatch: "full" }
        ]
    }
];
