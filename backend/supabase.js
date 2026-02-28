// backend/supabase.js
const { createClient } = require('@supabase/supabase-js');

// En Vercel, process.env ya tiene las variables cargadas directamente
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️ Advertencia: SUPABASE_URL o SUPABASE_SERVICE_KEY no están definidas.");
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

module.exports = supabase;
