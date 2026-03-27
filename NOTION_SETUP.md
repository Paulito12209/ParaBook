# Notion API Setup - Dokumentation automatisch erstellen

Dieses Script erstellt die Suchleiste-Dokumentation automatisch in Ihrem Notion Workspace.

## Schritt 1: Notion Integration erstellen

1. Gehen Sie zu https://www.notion.so/my-integrations
2. Klicken Sie auf "+ New integration"
3. Geben Sie einen Namen ein (z.B. "ParaBook Documentation")
4. Wählen Sie Ihren Workspace aus
5. Klicken Sie auf "Submit"
6. Kopieren Sie den **Internal Integration Token** (beginnt mit `secret_`)

## Schritt 2: Integration zu Ihrer Seite hinzufügen

1. Öffnen Sie die Notion-Seite, unter der die Dokumentation erstellt werden soll (z.B. Ihre "Ressourcen"-Seite oder Ihr "Join"-Projekt)
2. Klicken Sie oben rechts auf "..." → "Add connections"
3. Wählen Sie Ihre Integration aus
4. Die Page ID finden Sie in der URL: `notion.so/workspace/PAGE_ID` (die lange Zeichenkette nach dem letzten `/`)

## Schritt 3: Dependencies installieren

```bash
npm install @notionhq/client
```

## Schritt 4: Umgebungsvariablen setzen

### Option A: Als Umgebungsvariablen (temporär)

```bash
export NOTION_API_TOKEN="secret_ihr_token_hier"
export NOTION_PARENT_PAGE_ID="ihre_page_id_hier"
```

### Option B: Als .env Datei (empfohlen)

Erstellen Sie eine `.env` Datei im Projekt-Root:

```env
NOTION_API_TOKEN=secret_ihr_token_hier
NOTION_PARENT_PAGE_ID=ihre_page_id_hier
```

Dann installieren Sie `dotenv`:
```bash
npm install dotenv
```

Und fügen Sie am Anfang von `create-notion-page.js` hinzu:
```javascript
require('dotenv').config();
```

### Option C: Als Argument übergeben

```bash
node create-notion-page.js IHRE_PAGE_ID
```

(Der Token muss trotzdem als Umgebungsvariable gesetzt sein)

## Schritt 5: Script ausführen

```bash
node create-notion-page.js
```

Das Script wird:
- Die Markdown-Datei `Suchleiste-Dokumentation.md` lesen
- Sie in Notion-Blöcke konvertieren
- Eine neue Seite unter der angegebenen Parent Page erstellen
- Den Link zur erstellten Seite ausgeben

## Troubleshooting

### "unauthorized" Fehler
- Stellen Sie sicher, dass der API Token korrekt ist
- Prüfen Sie, ob die Integration Zugriff auf die Parent Page hat

### "object_not_found" Fehler
- Prüfen Sie, ob die Page ID korrekt ist (ohne Bindestriche)
- Stellen Sie sicher, dass die Integration zur Seite hinzugefügt wurde

### "Module not found: @notionhq/client"
- Führen Sie `npm install @notionhq/client` aus

## Verknüpfung mit Join-Projekt

Nachdem die Seite erstellt wurde:
1. Öffnen Sie die erstellte Dokumentationsseite in Notion
2. Fügen Sie eine Relation oder einen Link zu Ihrem Join-Projekt hinzu
3. Oder verwenden Sie Notion's "@" Mention-Funktion, um das Join-Projekt zu verlinken

