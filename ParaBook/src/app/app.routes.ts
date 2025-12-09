import { Routes } from '@angular/router';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { Projects } from './pages/projects/projects';
import { Resources } from './pages/resources/resources';
import { Areas } from './pages/areas/areas';
import { Archive } from './pages/archive/archive';

export const routes: Routes = [
    {
        path: "", component: MainLayout, children: [
            { path: "projects", component: Projects },
            { path: "resources", component: Resources },
            { path: "areas", component: Areas },
            { path: "archive", component: Archive },
            { path: "", redirectTo: "projects", pathMatch: "full" }
        ]
    }
];
