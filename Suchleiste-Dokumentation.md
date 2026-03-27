# Dokumentation: Suchleiste

## 1. Übersicht

Die Suchleiste ermöglicht es Benutzern, Projekte in Echtzeit zu durchsuchen. Sie filtert die Projektliste basierend auf dem eingegebenen Suchbegriff und aktualisiert die Anzeige automatisch.

---

## 2. HTML-Struktur

Die Suchleiste besteht aus einem Container mit einem SVG-Icon und einem Input-Feld:

```html
<div class="search-container">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="8" stroke="#999" stroke-width="2" />
        <path d="M21 21l-4.35-4.35" stroke="#999" stroke-width="2" stroke-linecap="round" />
    </svg>
    <input type="text" 
           placeholder="Search projects..." 
           [(ngModel)]="searchQuery" 
           (input)="onSearch()">
</div>
```

---

## 3. TypeScript-Implementierung

### 3.1 Variablen

```typescript
searchQuery = '';  // Speichert den aktuellen Suchbegriff
filteredProjects: Project[] = [...this.projects];  // Gefilterte Projektliste
```

### 3.2 Suchfunktion

```typescript
onSearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredProjects = this.projects.filter(project =>
        project.title.toLowerCase().includes(query)
    );
}
```

**Funktionsweise:**
- Der Suchbegriff wird in Kleinbuchstaben umgewandelt (case-insensitive Suche)
- Die Projekte werden gefiltert, wenn der Titel den Suchbegriff enthält
- Die gefilterte Liste wird in `filteredProjects` gespeichert

---

## 4. Angular-Bindung

Die Suchleiste verwendet Angular's Two-Way-Binding mit `[(ngModel)]`:

- **`[(ngModel)]="searchQuery"`**: Bindet den Input-Wert an die Variable
- **`(input)="onSearch()"`**: Ruft die Suchfunktion bei jeder Eingabe auf

**Wichtig:** `FormsModule` muss in den Component-Imports enthalten sein!

```typescript
imports: [FormsModule]
```

---

## 5. CSS-Styling

### 5.1 Container

```scss
.search-container {
    position: relative;
    display: flex;
    align-items: center;
}
```

### 5.2 SVG-Icon

```scss
svg {
    position: absolute;
    left: 16px;
    pointer-events: none;
}
```

### 5.3 Input-Feld

```scss
input {
    width: 100%;
    padding: 12px 16px 12px 48px;  /* Links-Padding für Icon */
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    background-color: white;
    transition: border-color 0.2s;

    &:focus {
        outline: none;
        border-color: #666;
    }

    &::placeholder {
        color: #999;
    }
}
```

---

## 6. Anwendung in Join-Projekt

### 6.1 Schritt-für-Schritt Anleitung

1. **HTML-Template erstellen:**
   ```html
   <div class="search-container">
       <svg>...</svg>
       <input [(ngModel)]="searchQuery" (input)="onSearch()">
   </div>
   ```

2. **TypeScript-Variablen hinzufügen:**
   ```typescript
   searchQuery = '';
   filteredItems: Item[] = [...this.items];
   ```

3. **Suchfunktion implementieren:**
   ```typescript
   onSearch() {
       const query = this.searchQuery.toLowerCase();
       this.filteredItems = this.items.filter(item =>
           item.name.toLowerCase().includes(query)
       );
   }
   ```

4. **FormsModule importieren:**
   ```typescript
   imports: [FormsModule, ...]
   ```

5. **Template mit gefilterter Liste verwenden:**
   ```html
   @for (item of filteredItems; track item.id) {
       <!-- Item anzeigen -->
   }
   ```

---

## 7. Erweiterte Funktionen

### 7.1 Suche in mehreren Feldern

```typescript
onSearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredProjects = this.projects.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.tags?.some(tag => tag.toLowerCase().includes(query))
    );
}
```

### 7.2 Debouncing für Performance

```typescript
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

private searchSubject = new Subject<string>();

ngOnInit() {
    this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
    ).subscribe(query => {
        this.performSearch(query);
    });
}

onSearch() {
    this.searchSubject.next(this.searchQuery);
}
```

### 7.3 Highlighting von Suchergebnissen

```typescript
highlightMatch(text: string, query: string): string {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}
```

---

## 8. Best Practices

- ✅ Case-insensitive Suche für bessere Benutzerfreundlichkeit
- ✅ Echtzeit-Filterung bei Eingabe
- ✅ Visuelles Feedback (Icon, Placeholder)
- ✅ Accessibility: ARIA-Labels für Screenreader
- ✅ Performance: Debouncing bei großen Datenmengen
- ✅ Responsive Design: Mobile-optimiert

---

## 9. Troubleshooting

### Problem: ngModel funktioniert nicht
**Lösung:** FormsModule in imports hinzufügen

### Problem: Suche ist case-sensitive
**Lösung:** `.toLowerCase()` auf Query und Vergleichsfeld anwenden

### Problem: Liste wird nicht aktualisiert
**Lösung:** Sicherstellen, dass `filteredProjects` im Template verwendet wird, nicht `projects`

---

## 10. Vollständiges Beispiel

```typescript
// project-list.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-project-list',
    imports: [FormsModule],
    templateUrl: './project-list.html'
})
export class ProjectList {
    searchQuery = '';
    projects = [
        { id: 1, title: 'Projekt 1' },
        { id: 2, title: 'Projekt 2' }
    ];
    filteredProjects = [...this.projects];

    onSearch() {
        const query = this.searchQuery.toLowerCase();
        this.filteredProjects = this.projects.filter(p =>
            p.title.toLowerCase().includes(query)
        );
    }
}
```

```html
<!-- project-list.html -->
<div class="search-container">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="8" stroke="#999" stroke-width="2" />
        <path d="M21 21l-4.35-4.35" stroke="#999" stroke-width="2" stroke-linecap="round" />
    </svg>
    <input type="text" 
           placeholder="Search projects..." 
           [(ngModel)]="searchQuery" 
           (input)="onSearch()">
</div>

<div class="projects">
    @for (project of filteredProjects; track project.id) {
        <div class="project-card">
            <h3>{{ project.title }}</h3>
        </div>
    }
</div>
```

---

## Verknüpfung mit Join-Projekt

Diese Dokumentation ist Teil des **Join-Projekts** und beschreibt die Implementierung der Suchleiste, die in der ParaBook-Anwendung verwendet wird.

**Verwendete Technologien:**
- Angular 17+
- TypeScript
- SCSS
- FormsModule für Two-Way-Binding

