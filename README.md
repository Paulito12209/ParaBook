## Projektüberblick

- **Titel:** PARA BOOK
- **Kurzbeschreibung:** App nach PARA‑Methode mit Bereichen Projekte, Workspaces, Ressourcen und Archiv.
- **Ziel:** Lern‑MVP mit sauberer Struktur, einfacher Projektliste links und Detailpanel rechts.

---

## UI‑Design Leitlinien

<aside>
<img src="/icons/palette_purple.svg" alt="/icons/palette_purple.svg" width="40px" />

**Farben**

- Hintergrund: sehr dunkel blau‑grau (#0D1420 bis #0F172A)
- Karten: dunkel mit subtilen Verläufen, Akzent **Magenta‑Violett** für Hero‑Card
- Primärbutton: dunkelblau mit hellen States
- Text: helles Grau, Überschriften Weiß
</aside>

<aside>
<img src="/icons/typography_blue.svg" alt="/icons/typography_blue.svg" width="40px" />

**Typografie & Abstände**

- Großes Titel‑Weight für Projektkarten
- 8px‑Spacing‑Raster, großzügige Padding auf Karten
- Runde Ecken 12–16px
</aside>

---

## Informationsarchitektur

- Sidebar: Projekte, Workspaces, Ressourcen, Archiv, unten Settings
- Header: Sprache, Theme, Profil‑Badge
- Content:
    
    1) Liste links mit Suche und "Add New Project"
    
    2) Rechts Detailkarte mit Titel, Beschreibung, Aktionen (Bearbeiten, Löschen)
    

---

## Tech‑Stack

- Angular, TypeScript, SCSS
- Firebase Firestore + Hosting
- i18n optional, Theme Toggle Light/Dark

---

## Setup

1) Repo klonen

2) Dependencies installieren: `npm i`

3) Firebase Config in `environment.ts` einfügen

4) Dev‑Server starten: `npm start` → http://localhost:4200

---

## NPM‑Skripte

- `start` – Dev‑Server
- `build` – Production Build
- `lint` – Linting
- `deploy` – Firebase Hosting Deploy

---

## Ordnerstruktur

```
para-book/
├─ public/                # Statische Assets (statt src/assets)
│  ├─ img/                # Bilder, Icons, Illustrationen
│  ├─ fonts/              # Webfonts
│  ├─ locales/            # i18n JSONs (de.json, en.json)
│  └─ favicon.ico
├─ src/
│  ├─ app/
│  │  ├─ core/            # Services (firebase, theme, i18n), models
│  │  ├─ data/            # Domänendienste (projects, areas, resources)
│  │  ├─ layout/          # Header, Sidebar, Shell
│  │  ├─ features/
│  │  │  ├─ projekte/     # Liste + Detailpanel
│  │  │  ├─ arbeitsbereiche/
│  │  │  ├─ ressourcen/
│  │  │  └─ archiv/
│  │  └─ shared/          # UI‑Bausteine (Button, Card, Avatar)
```

<aside>
<img src="/icons/info-alternate_blue.svg" alt="/icons/info-alternate_blue.svg" width="40px" />

Aktualisierung: Anstelle von `src/assets` wird ein `public/`‑Ordner verwendet. Alle statischen Dateien (Bilder, Fonts, i18n) liegen unter `public/` und werden direkt ausgeliefert.

</aside>

---

## Komponenten‑Richtlinien

- Buttons: klare Ikonen, minimaler Text, Fokus‑ und Hover‑States
- Karten: Titel groß, Untertitel klein, Meta „Updated x ago“
- Leere Zustände: dezente Platzhaltertexte

---

## Zustände & Interaktionen

- Suche filtert Liste live
- Auswahl markiert Karte in der Liste und lädt rechts das Detailpanel
- Aktionen: Bearbeiten ✎, Löschen 🗑️ mit Confirm

---

## Qualitätsregeln

- Keine Console‑Errors
- Responsive bis 320px, Desktop‑First Layout
- Funktionen ≤ 14 Zeilen, sprechende Namen

---

## Lizenz & Autor:innen

- Lernprojekt von Paul Angeles. Alle Rechte vorbehalten.
