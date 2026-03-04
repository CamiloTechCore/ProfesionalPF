const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Validación de variables de entorno críticas
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error("Faltan las credenciales de Supabase en el archivo .env");
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

module.exports = supabase;