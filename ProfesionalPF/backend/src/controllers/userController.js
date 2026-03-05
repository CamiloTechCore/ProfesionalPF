const supabase = require('../supabaseClient');
const bcrypt = require('bcrypt');
const { calculateAge } = require('../utils/calculators');

/**
 * Registro de Usuario con Seguridad Bcrypt (Fase 3.3)
 */
const signupUser = async (req, res) => {
    const { FULL_NAME, EMAIL, BIRTH_DATE, PASSWORD } = req.body;

    try {
        // 1. Cifrar la contraseña antes de guardar
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(PASSWORD, salt);

        // 2. Insertar en tabla 'users' (minúsculas por image_a16895.png)
        const { data, error } = await supabase
            .from('users')
            .insert([{
                full_name: FULL_NAME,
                email: EMAIL,
                birth_date: BIRTH_DATE,
                password_hash: hashedPassword, // Columna añadida por SQL
                auth_method: 'traditional'
            }])
            .select();

        if (error) throw error;

        res.status(201).json({ 
            message: "Usuario registrado con éxito y contraseña protegida.",
            user: data[0] 
        });
    } catch (err) {
        console.error("Error en Signup:", err.message);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Obtener Perfil y Calcular Edad Dinámicamente (Fase 4.1)
 */
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { data: user, error } = await supabase
            .from('users')
            .select('full_name, email, birth_date')
            .eq('user_id', userId)
            .single();

        if (error) throw error;

        // Cálculo dinámico (No se guarda en DB para ser siempre exacto)
        const age = calculateAge(user.birth_date);

        res.json({
            ...user,
            age,
            can_edit_birth_date: false // Restricción de seguridad Roadmap 4.1
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { signupUser, getUserProfile };