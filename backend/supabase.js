// backend/supabase.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Usamos SERVICE_KEY para el backend porque tiene permisos totales

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ ERROR: Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_KEY en el .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
