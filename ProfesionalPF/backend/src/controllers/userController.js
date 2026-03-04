const supabase = require('../config/supabase');
const userSchema = require('../models/userModel');

const registerUser = async (req, res) => {
    const { FULL_NAME, EMAIL, BIRTH_DATE, AUTH_METHOD } = req.body;

    // 1. Validaciones según el modelo
    if (!userSchema.FULL_NAME(FULL_NAME)) {
        return res.status(400).json({ error: "Nombre inválido o excede 40 caracteres." });
    }

    // 2. Cálculo dinámico de edad (Lógica de Negocio)
    const birth = new Date(BIRTH_DATE);
    const age = Math.floor((new Date() - birth) / (365.25 * 24 * 60 * 60 * 1000));

    try {
        const { data, error } = await supabase
            .from('USERS')
            .insert([{ FULL_NAME, EMAIL, BIRTH_DATE, AUTH_METHOD }])
            .select();

        if (error) throw error;

        res.status(201).json({
            message: "Registro exitoso",
            user: data[0],
            age_at_registration: age
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { registerUser };