require('dotenv').config();
const { Pool } = require('pg');

// La URL de conexión se obtiene de Supabase:
// Settings -> Database -> Connection String -> URI
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("⚠️ ERROR: No se encuentra DATABASE_URL en el archivo .env");
  console.warn("Sigue estos pasos:");
  console.warn("1. Ve a Supabase -> Settings -> Database");
  console.warn("2. Busca 'Connection String' -> 'URI'");
  console.warn("3. Copia esa URL y pégala en backend/.env como DATABASE_URL=...");
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false // Necesario para conexiones a Supabase desde entornos locales
  }
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
});

module.exports = pool;
