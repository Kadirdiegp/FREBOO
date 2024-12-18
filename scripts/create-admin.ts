require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    console.log('Erstelle Admin-Benutzer...');

    // Admin-Benutzer erstellen
    const { data: user, error: createError } = await supabase.auth.admin.createUser({
      email: 'admin@frebo-media.com',
      password: 'admin123456',
      email_confirm: true
    });

    if (createError) throw createError;
    console.log('Admin-Benutzer erfolgreich erstellt:', user);

    // RLS-Policies temporär deaktivieren
    const { error: rls1 } = await supabase.rpc('disable_rls', { table_name: 'events' });
    const { error: rls2 } = await supabase.rpc('disable_rls', { table_name: 'photos' });
    
    if (rls1 || rls2) {
      console.warn('Warnung: Konnte RLS nicht deaktivieren. Fahre trotzdem fort...');
    } else {
      console.log('RLS-Policies erfolgreich deaktiviert');
    }

  } catch (error) {
    console.error('Fehler beim Erstellen des Admin-Benutzers:', error);
    process.exit(1);
  }
}

createAdminUser(); 