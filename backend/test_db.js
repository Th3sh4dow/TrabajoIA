require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

console.log("URL:", supabaseUrl);
console.log("Key prefix:", supabaseKey ? supabaseKey.substring(0, 10) : "null");

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    try {
        const { data, error } = await supabase.from('products').select('*').limit(1);
        if (error) {
            console.error("DETAILED ERROR:", error);
        } else {
            console.log("SUCCESS! Data:", data);
        }
    } catch (err) {
        console.error("EXCEPTIONAL ERROR:", err);
    }
}

test();
