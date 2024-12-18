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
  startNumber?: string;
  eventId?: string;
}

async function uploadImage({ filePath, category, startNumber, eventId }: ImageUploadConfig) {
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
      url: storagePath, // Speichere nur den relativen Pfad
      category,
      start_number: startNumber,
      event_id: eventId,
    }]);

    if (dbError) throw dbError;

    console.log(`Erfolgreich hochgeladen: ${filePath}`);
    return storagePath;
  } catch (error) {
    console.error(`Fehler beim Hochladen von ${filePath}:`, error);
    throw error;
  }
}

// Funktion zum Hochladen mehrerer Bilder
async function uploadImages(images: ImageUploadConfig[]) {
  for (const image of images) {
    try {
      await uploadImage(image);
    } catch (error) {
      console.error(`Fehler beim Verarbeiten von ${image.filePath}:`, error);
    }
  }
}

// Motocross-Bilder konfigurieren
const mxBasePath = '/Users/kadirdiegopadinrodriguez/Desktop/frebo_sport_images';
const mxImages: ImageUploadConfig[] = [
  { filePath: path.join(mxBasePath, '1P8A5089a.jpg'), category: 'motocross', startNumber: '114' },
  { filePath: path.join(mxBasePath, '1P8A6707.JPG'), category: 'motocross', startNumber: '217' },
  { filePath: path.join(mxBasePath, '467A3638-Verbessert-RR.jpg'), category: 'motocross', startNumber: '325' },
  { filePath: path.join(mxBasePath, '467A4611-Verbessert-RR.jpg'), category: 'motocross', startNumber: '441' },
  { filePath: path.join(mxBasePath, 'IMG_0402.JPG'), category: 'motocross', startNumber: '512' },
  { filePath: path.join(mxBasePath, 'IMG_0883.JPG'), category: 'motocross', startNumber: '167' },
  { filePath: path.join(mxBasePath, 'IMG_3090.JPG'), category: 'motocross', startNumber: '289' },
  { filePath: path.join(mxBasePath, 'IMG_3689.jpg'), category: 'motocross', startNumber: '333' },
  { filePath: path.join(mxBasePath, 'IMG_3823.jpg'), category: 'motocross', startNumber: '445' },
  { filePath: path.join(mxBasePath, 'IMG_8102.JPG'), category: 'motocross', startNumber: '178' },
  { filePath: path.join(mxBasePath, 'IMG_8145.JPG'), category: 'motocross', startNumber: '234' },
  { filePath: path.join(mxBasePath, 'IMG_8686.JPG'), category: 'motocross', startNumber: '567' },
  { filePath: path.join(mxBasePath, 'IMG_8703.jpg'), category: 'motocross', startNumber: '189' },
  { filePath: path.join(mxBasePath, 'IMG_8742.JPG'), category: 'motocross', startNumber: '276' },
  { filePath: path.join(mxBasePath, 'IMG_8752.jpg'), category: 'motocross', startNumber: '398' },
  { filePath: path.join(mxBasePath, '_67A7359.jpg'), category: 'motocross', startNumber: '412' },
  { filePath: path.join(mxBasePath, '_67A7381.jpg'), category: 'motocross', startNumber: '156' },
  { filePath: path.join(mxBasePath, '_67A7406.jpg'), category: 'motocross', startNumber: '278' },
  { filePath: path.join(mxBasePath, '_67A9499.jpg'), category: 'motocross', startNumber: '345' },
  { filePath: path.join(mxBasePath, '_67A9518.jpg'), category: 'motocross', startNumber: '423' },
  { filePath: path.join(mxBasePath, '_MG_8629.JPG'), category: 'motocross', startNumber: '187' },
  { filePath: path.join(mxBasePath, '_P8A1394.JPG'), category: 'motocross', startNumber: '299' },
  { filePath: path.join(mxBasePath, '_P8A1613a.jpg'), category: 'motocross', startNumber: '456' },
  { filePath: path.join(mxBasePath, '_P8A1751a.jpg'), category: 'motocross', startNumber: '134' }
];

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

// Event erstellen
async function createEvent() {
  console.log('Erstelle neues Event...');
  const { data: event, error } = await supabase
    .from('events')
    .insert([
      {
        name: 'ADAC MX Masters 2024',
        date: '2024-03-15',
        location: 'Dreetz',
        description: 'ADAC MX Masters Auftakt 2024'
      }
    ])
    .select()
    .single();

  if (error) throw error;
  console.log('Event erfolgreich erstellt:', event);
  return event.id;
}

// Hauptfunktion zum Ausführen des Uploads
async function main() {
  try {
    console.log('Starte Upload...');
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
    
    // Event erstellen
    const eventId = await createEvent();
    console.log('Event erstellt:', eventId);

    // Bilder mit Event-ID verknüpfen
    const mxImagesWithEvent = mxImages.map(img => ({
      ...img,
      eventId
    }));

    // Alle Bilder hochladen
    console.log(`Starte Upload von ${mxImagesWithEvent.length} Motocross-Bildern und ${portraitImages.length} Portrait-Bildern...`);
    await uploadImages([...mxImagesWithEvent, ...portraitImages]);
    console.log('Upload abgeschlossen!');
  } catch (error) {
    console.error('Fehler beim Upload:', error);
    process.exit(1);
  }
}

main(); 