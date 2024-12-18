require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Email und Passwort für die Authentifizierung
const ADMIN_EMAIL = 'admin@frebo-media.com';
const ADMIN_PASSWORD = 'admin123456';

interface ImageUploadConfig {
  filePath: string;
  category: 'motocross' | 'portrait' | 'product';
}

async function uploadImage({ filePath, category }: ImageUploadConfig) {
  try {
    // Dateinamen generieren
    const fileExt = path.extname(filePath);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
    const storagePath = `${category}/${fileName}`;

    console.log(`Verarbeite ${filePath}...`);

    // Prüfen, ob die Datei existiert
    if (!fs.existsSync(filePath)) {
      throw new Error(`Datei nicht gefunden: ${filePath}`);
    }

    // Datei hochladen
    const fileBuffer = await fs.promises.readFile(filePath);
    console.log(`Lade ${filePath} hoch...`);
    
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(storagePath, fileBuffer);

    if (uploadError) throw uploadError;

    console.log(`Erstelle Datenbankeintrag für ${filePath}...`);

    // Eintrag in der Datenbank erstellen mit relativem Pfad
    const { error: dbError } = await supabase.from('photos').insert([{
      url: storagePath,
      category
    }]);

    if (dbError) throw dbError;

    console.log(`Erfolgreich hochgeladen: ${filePath}`);
    return storagePath;
  } catch (error) {
    console.error(`Fehler beim Hochladen von ${filePath}:`, error);
    throw error;
  }
}

// Portrait-Bilder konfigurieren
const portraitBasePath = '/Users/kadirdiegopadinrodriguez/Desktop/pör';
const portraitImages: ImageUploadConfig[] = [
  { filePath: path.join(portraitBasePath, 'IMG_3046.JPG'), category: 'portrait' },
  { filePath: path.join(portraitBasePath, 'IMG_3047.JPG'), category: 'portrait' },
  { filePath: path.join(portraitBasePath, 'IMG_3048.JPG'), category: 'portrait' },
  { filePath: path.join(portraitBasePath, 'IMG_5339.JPG'), category: 'portrait' },
  { filePath: path.join(portraitBasePath, 'IMG_5693.JPEG'), category: 'portrait' },
  { filePath: path.join(portraitBasePath, 'IMG_7863.JPG'), category: 'portrait' },
  { filePath: path.join(portraitBasePath, 'IMG_7870.JPG'), category: 'portrait' },
  { filePath: path.join(portraitBasePath, 'IMG_7871.JPG'), category: 'portrait' },
  { filePath: path.join(portraitBasePath, 'IMG_9932.JPG'), category: 'portrait' },
  { filePath: path.join(portraitBasePath, 'IMG_9933.JPG'), category: 'portrait' },
  { filePath: path.join(portraitBasePath, 'IMG_9934.JPG'), category: 'portrait' }
];

// Hauptfunktion zum Ausführen des Uploads
async function main() {
  try {
    console.log('Starte Upload der Portrait-Bilder...');
    console.log('Supabase URL:', supabaseUrl);

    // Authentifizierung
    console.log('Authentifiziere...');
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (authError) {
      throw new Error(`Authentifizierungsfehler: ${authError.message}`);
    }

    console.log('Erfolgreich authentifiziert!');

    // Bilder hochladen
    for (const image of portraitImages) {
      try {
        await uploadImage(image);
      } catch (error) {
        console.error(`Fehler beim Verarbeiten von ${image.filePath}:`, error);
      }
    }

    console.log('Upload abgeschlossen!');
  } catch (error) {
    console.error('Fehler beim Upload:', error);
    process.exit(1);
  }
}

main(); 