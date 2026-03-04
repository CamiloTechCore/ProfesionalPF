const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Extraemos las variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Inicializamos el cliente oficial
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("✅ Conexión con Supabase configurada correctamente.");

module.exports = supabase;