# FREBO MEDIA Portfolio Website

Eine moderne Portfolio-Website für FREBO MEDIA mit Fokus auf Motocross-, Portrait- und Produktfotografie.

## Features

- Responsive Design
- Portfolio-Übersicht mit Kategorien
- Motocross Event-Galerie mit Startnummernfilter
- Admin Content Management System
- Supabase Backend für Datenspeicherung

## Technologien

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- React Icons

## Installation

1. Repository klonen:
```bash
git clone https://github.com/your-username/frebo-media.git
cd frebo-media
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. Umgebungsvariablen konfigurieren:
Erstellen Sie eine `.env.local` Datei im Root-Verzeichnis mit folgenden Variablen:
```
NEXT_PUBLIC_SUPABASE_URL=ihre_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=ihr_supabase_anon_key
```

4. Entwicklungsserver starten:
```bash
npm run dev
```

Die Anwendung ist nun unter `http://localhost:3000` verfügbar.

## Supabase Setup

1. Erstellen Sie ein neues Projekt auf [Supabase](https://supabase.com)
2. Erstellen Sie folgende Tabellen in Ihrer Supabase-Datenbank:

### Events Tabelle
```sql
create table events (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  date date not null,
  location text not null,
  description text,
  cover_image text
);
```

### Photos Tabelle
```sql
create table photos (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  url text not null,
  start_number text,
  event_id uuid references events(id),
  thumbnail_url text,
  category text not null check (category in ('motocross', 'portrait', 'product'))
);
```

## Deployment

Die Anwendung kann auf verschiedenen Plattformen deployed werden. Wir empfehlen [Vercel](https://vercel.com) für das beste Next.js Deployment-Erlebnis:

1. Pushen Sie Ihren Code zu GitHub
2. Verbinden Sie Ihr Repository mit Vercel
3. Vercel wird automatisch die Umgebungsvariablen aus Ihrem Projekt übernehmen
4. Die Anwendung wird automatisch gebaut und deployed

## Lizenz

MIT 