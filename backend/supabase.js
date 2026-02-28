// backend/supabase.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("🚨 ERROR CRÍTICO: Las variables de entorno de Supabase NO están llegando al backend.");
    console.log("Variables detectadas:", {
        url: supabaseUrl ? "CONFIGURADA ✅" : "VACÍA ❌",
        key: supabaseKey ? "CONFIGURADA ✅" : "VACÍA ❌"
    });
}

// Inicializamos aunque sea con strings vacíos para evitar que la app explote antes de dar el log
const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');

module.exports = supabase;
