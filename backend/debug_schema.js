require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    const tables = ['products', 'orders', 'reviews', 'users', 'carrito'];
    for (const table of tables) {
        console.log(`\n--- Table: ${table} ---`);
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.error(`Error checking ${table}:`, error.message);
        } else {
            console.log(`Table ${table} exists.`);
            if (data.length > 0) {
                console.log("Columns found:", Object.keys(data[0]).join(', '));
            } else {
                console.log("Empty table, cannot determine columns via SELECT *.");
            }
        }
    }
}

checkSchema();
