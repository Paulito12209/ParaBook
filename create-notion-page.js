#!/usr/bin/env node

/**
 * Script zum Erstellen einer Notion-Seite mit der Suchleiste-Dokumentation
 * 
 * Verwendung:
 * 1. npm install @notionhq/client
 * 2. Notion API Token und Parent Page ID in .env oder als Umgebungsvariablen setzen
 * 3. node create-notion-page.js
 */

// Optional: dotenv für .env Dateien unterstützen
try {
  require('dotenv').config();
} catch (e) {
  // dotenv nicht installiert, verwende nur Umgebungsvariablen
}

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Notion API Client initialisieren
const notion = new Client({
  auth: process.env.NOTION_API_TOKEN || process.env.NOTION_TOKEN,
});

/**
 * Konvertiert Markdown zu Notion-Blöcken
 */
function markdownToNotionBlocks(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let currentCodeBlock = null;
  let currentCodeLanguage = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Code-Blöcke erkennen
    if (line.startsWith('```')) {
      if (currentCodeBlock === null) {
        // Code-Block startet
        currentCodeLanguage = line.substring(3).trim() || 'plain text';
        currentCodeBlock = [];
      } else {
        // Code-Block endet
        blocks.push({
          object: 'block',
          type: 'code',
          code: {
            rich_text: [{
              type: 'text',
              text: { content: currentCodeBlock.join('\n') }
            }],
            language: currentCodeLanguage,
            caption: []
          }
        });
        currentCodeBlock = null;
        currentCodeLanguage = '';
      }
      continue;
    }

    if (currentCodeBlock !== null) {
      currentCodeBlock.push(line);
      continue;
    }

    // Überschriften
    if (line.startsWith('# ')) {
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: line.substring(2).trim() } }]
        }
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: line.substring(3).trim() } }]
        }
      });
    } else if (line.startsWith('### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{ type: 'text', text: { content: line.substring(4).trim() } }]
        }
      });
    } else if (line.startsWith('#### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{ type: 'text', text: { content: line.substring(5).trim() } }]
        }
      });
    }
    // Horizontale Linie
    else if (line.trim() === '---') {
      blocks.push({
        object: 'block',
        type: 'divider',
        divider: {}
      });
    }
    // Listen
    else if (line.match(/^[-*]\s/)) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: parseRichText(line.substring(2).trim())
        }
      });
    } else if (line.match(/^\d+\.\s/)) {
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: parseRichText(line.replace(/^\d+\.\s/, '').trim())
        }
      });
    }
    // Fettdruck
    else if (line.includes('**')) {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: parseRichText(line)
        }
      });
    }
    // Leerzeile ignorieren
    else if (line.trim() === '') {
      // Leerzeilen werden ignoriert, aber wir könnten einen leeren Paragraph hinzufügen
    }
    // Normaler Text
    else {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: parseRichText(line)
        }
      });
    }
  }

  return blocks;
}

/**
 * Parst Rich Text mit Formatierungen
 */
function parseRichText(text) {
  const richText = [];
  let currentIndex = 0;
  
  // Fettdruck **text**
  const boldRegex = /\*\*(.*?)\*\*/g;
  let match;
  let lastIndex = 0;
  
  while ((match = boldRegex.exec(text)) !== null) {
    // Text vor dem Fettdruck
    if (match.index > lastIndex) {
      richText.push({
        type: 'text',
        text: { content: text.substring(lastIndex, match.index) }
      });
    }
    // Fettgedruckter Text
    richText.push({
      type: 'text',
      text: { content: match[1] },
      annotations: { bold: true }
    });
    lastIndex = match.index + match[0].length;
  }
  
  // Restlicher Text
  if (lastIndex < text.length) {
    richText.push({
      type: 'text',
      text: { content: text.substring(lastIndex) }
    });
  }
  
  // Wenn kein Fettdruck gefunden wurde, gesamten Text zurückgeben
  if (richText.length === 0) {
    richText.push({
      type: 'text',
      text: { content: text }
    });
  }
  
  return richText;
}

/**
 * Hauptfunktion zum Erstellen der Notion-Seite
 */
async function createNotionPage() {
  try {
    // Prüfe ob API Token vorhanden ist
    if (!process.env.NOTION_API_TOKEN && !process.env.NOTION_TOKEN) {
      console.error('❌ Fehler: NOTION_API_TOKEN oder NOTION_TOKEN Umgebungsvariable nicht gesetzt!');
      console.log('\n📝 So richten Sie es ein:');
      console.log('1. Erstellen Sie eine Integration auf https://www.notion.so/my-integrations');
      console.log('2. Kopieren Sie den "Internal Integration Token"');
      console.log('3. Setzen Sie die Umgebungsvariable:');
      console.log('   export NOTION_API_TOKEN="your_token_here"');
      console.log('   Oder erstellen Sie eine .env Datei mit: NOTION_API_TOKEN=your_token_here');
      process.exit(1);
    }

    // Parent Page ID aus Umgebungsvariable oder als Argument
    const parentPageId = process.env.NOTION_PARENT_PAGE_ID || process.argv[2];
    
    if (!parentPageId) {
      console.error('❌ Fehler: NOTION_PARENT_PAGE_ID nicht gesetzt!');
      console.log('\n📝 So finden Sie die Parent Page ID:');
      console.log('1. Öffnen Sie die Notion-Seite, unter der die neue Seite erstellt werden soll');
      console.log('2. Die Page ID finden Sie in der URL: notion.so/workspace/PAGE_ID');
      console.log('3. Setzen Sie die Umgebungsvariable:');
      console.log('   export NOTION_PARENT_PAGE_ID="your_page_id_here"');
      console.log('   Oder übergeben Sie sie als Argument: node create-notion-page.js YOUR_PAGE_ID');
      process.exit(1);
    }

    // Markdown-Datei lesen
    const markdownPath = path.join(__dirname, 'Suchleiste-Dokumentation.md');
    if (!fs.existsSync(markdownPath)) {
      console.error(`❌ Fehler: Datei ${markdownPath} nicht gefunden!`);
      process.exit(1);
    }

    const markdown = fs.readFileSync(markdownPath, 'utf-8');
    
    // Titel extrahieren (erste Überschrift)
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : 'Suchleiste Dokumentation';

    // Markdown zu Notion-Blöcken konvertieren
    console.log('🔄 Konvertiere Markdown zu Notion-Blöcken...');
    const blocks = markdownToNotionBlocks(markdown);

    // Seite erstellen
    console.log('📄 Erstelle Notion-Seite...');
    const response = await notion.pages.create({
      parent: {
        type: 'page_id',
        page_id: parentPageId.replace(/-/g, ''),
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
      },
    });

    const pageId = response.id;
    console.log(`✅ Seite erstellt: ${response.url}`);

    // Blöcke zur Seite hinzufügen (in Batches von 100)
    console.log('📝 Füge Inhalte hinzu...');
    const batchSize = 100;
    for (let i = 0; i < blocks.length; i += batchSize) {
      const batch = blocks.slice(i, i + batchSize);
      await notion.blocks.children.append({
        block_id: pageId,
        children: batch,
      });
      console.log(`   ${Math.min(i + batchSize, blocks.length)}/${blocks.length} Blöcke hinzugefügt`);
    }

    console.log('\n✅ Dokumentation erfolgreich in Notion erstellt!');
    console.log(`🔗 Link: ${response.url}`);
    
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Notion-Seite:');
    if (error.code === 'unauthorized') {
      console.error('   → API Token ist ungültig oder die Integration hat keine Berechtigung');
    } else if (error.code === 'object_not_found') {
      console.error('   → Parent Page ID ist ungültig oder die Integration hat keinen Zugriff');
    } else {
      console.error('   →', error.message);
    }
    console.error('\n💡 Tipp: Stellen Sie sicher, dass:');
    console.error('   1. Die Integration Zugriff auf die Parent Page hat');
    console.error('   2. Der API Token korrekt ist');
    console.error('   3. Die Parent Page ID korrekt ist (ohne Bindestriche)');
    process.exit(1);
  }
}

// Script ausführen
createNotionPage();

