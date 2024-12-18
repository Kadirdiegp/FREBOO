# Entwickler-Dokumentation FREBO MEDIA

## Erste Schritte

1. Repository klonen und Abhängigkeiten installieren:
```bash
git clone <repository-url>
cd frebo-media
npm install
```

2. Supabase-Projekt einrichten:
   - Gehen Sie zu [Supabase](https://supabase.com) und erstellen Sie ein neues Projekt
   - Kopieren Sie die Projekt-URL und den anonymen API-Key
   - Diese sind bereits in der `.env.local` konfiguriert

3. Datenbank initialisieren:
   - Öffnen Sie den SQL-Editor in Ihrem Supabase-Projekt
   - Kopieren Sie den Inhalt von `scripts/init-db.sql`
   - Führen Sie das Skript aus

4. Admin-Benutzer erstellen:
   - Gehen Sie zu Authentication > Users in Ihrem Supabase-Projekt
   - Klicken Sie auf "Invite user"
   - Geben Sie die Admin-E-Mail-Adresse ein
   - Der Benutzer erhält eine E-Mail zum Setzen des Passworts

5. Entwicklungsserver starten:
```bash
npm run dev
```

## Projektstruktur

```
frebo-media/
├── src/
│   ├── components/     # Wiederverwendbare UI-Komponenten
│   ├── lib/           # Hilfsfunktionen und API-Clients
│   ├── pages/         # Next.js Seiten und API-Routes
│   └── styles/        # Globale Styles und Tailwind-Konfiguration
├── public/            # Statische Assets
└── scripts/          # Datenbank-Skripte und andere Hilfsskripte
```

## Wichtige Komponenten

### AdminAuth
- Authentifizierung für den Admin-Bereich
- Verwendet Supabase Auth
- Geschützte Routen unter `/admin`

### Layout
- Hauptlayout mit Navigation und Footer
- Verwendet in allen Seiten

### Supabase Integration
- Client konfiguriert in `lib/supabase.ts`
- Typen für Events und Photos
- Hilfsfunktionen für Datenbank-Operationen

## Deployment

1. Code auf GitHub pushen
2. Vercel-Projekt einrichten:
   - Verbinden Sie Ihr GitHub-Repository
   - Fügen Sie die Umgebungsvariablen hinzu:
     ```
     NEXT_PUBLIC_SUPABASE_URL=ihre_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=ihr_supabase_anon_key
     ```
   - Deployment wird automatisch gestartet

## Entwicklungsrichtlinien

1. **Code-Style**
   - TypeScript strict mode aktiviert
   - ESLint für Code-Qualität
   - Prettier für Formatierung

2. **Komponenten**
   - Funktionale Komponenten mit TypeScript
   - Props-Interfaces definieren
   - Tailwind für Styling

3. **State Management**
   - React Hooks für lokalen State
   - Supabase für Backend-State
   - Keine zusätzliche State-Management-Bibliothek

4. **Bildverarbeitung**
   - Bilder werden in Supabase Storage gespeichert
   - Thumbnails werden beim Upload generiert
   - Next.js Image-Komponente für optimierte Darstellung

5. **Performance**
   - Lazy Loading für Bilder
   - Pagination für Foto-Galerien
   - Caching von Supabase-Queries

## Bekannte Probleme

1. Bildupload
   - Große Dateien können zu Timeout führen
   - Lösung: Chunked Upload implementieren

2. Startnummern-Filter
   - Case-sensitive Suche
   - Lösung: Case-insensitive Suche implementieren

## Nächste Schritte

1. Implementierung von Bildoptimierung
2. Erweiterte Suchfunktionen
3. Batch-Operationen für Fotos
4. Admin-Statistiken Dashboard 