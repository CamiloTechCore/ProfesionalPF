const supabase = require('../supabaseClient');
const bcrypt = require('bcrypt');
const { calculateAge } = require('../utils/calculators');

/**
 * 1. REGISTRO TRADICIONAL
 * Crea un usuario con contraseña cifrada y método 'traditional'.
 */
const signupUser = async (req, res) => {
    const { FULL_NAME, EMAIL, BIRTH_DATE, PASSWORD } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(PASSWORD, salt);

        const { data, error } = await supabase
            .from('users')
            .insert([{
                full_name: FULL_NAME,
                email: EMAIL,
                birth_date: BIRTH_DATE,
                password_hash: hashedPassword,
                auth_method: 'traditional'
            }])
            .select();

        if (error) throw error;
        res.status(201).json({ message: "Usuario registrado con éxito", user: data[0] });
    } catch (err) {
        console.error("Error en Signup:", err.message);
        res.status(500).json({ error: err.message });
    }
};

/**
 * 2. INICIO DE SESIÓN TRADICIONAL
 * Valida credenciales contra el hash de la base de datos.
 */
const loginUser = async (req, res) => {
    const { EMAIL, PASSWORD } = req.body;
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', EMAIL)
            .maybeSingle(); // Cambiado a maybeSingle para control de errores limpio

        if (error || !user) return res.status(401).json({ error: "Credenciales inválidas" });

        // Validar que el usuario tenga contraseña (los de Google no tienen)
        if (!user.password_hash) {
            return res.status(401).json({ error: "Este correo usa inicio de sesión con Google" });
        }

        const isMatch = await bcrypt.compare(PASSWORD, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: "Credenciales inválidas" });

        res.json({
            message: "Login exitoso",
            user: { id: user.user_id, name: user.full_name, email: user.email }
        });
    } catch (err) {
        console.error("Error en Login:", err.message);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

/**
 * 3. AUTENTICACIÓN CON GOOGLE (Registro Silencioso)
 * Si el email existe, inicia sesión. Si no, crea el perfil automáticamente.
 */
const googleAuth = async (req, res) => {
    const { EMAIL, FULL_NAME, GOOGLE_ID } = req.body;

    try {
        // 🚩 maybeSingle() evita que Supabase lance un error 406 si el usuario no existe
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', EMAIL)
            .maybeSingle();

        if (fetchError) throw fetchError;

        if (user) {
            // Caso: El usuario ya existe -> Login directo
            return res.json({
                message: "Login con Google exitoso",
                user: { id: user.user_id, name: user.full_name, email: user.email }
            });
        }

        // Caso: Usuario nuevo -> Registro automático sin contraseña obligatoria
        const { data: newUser, error: signupError } = await supabase
            .from('users')
            .insert([{
                full_name: FULL_NAME,
                email: EMAIL,
                auth_method: 'google',
                google_id: GOOGLE_ID,
                // password_hash queda como null (requiere ALTER TABLE en Supabase)
            }])
            .select();

        if (signupError) {
            console.error("Detalle error insert Supabase:", signupError);
            throw signupError;
        }

        res.status(201).json({
            message: "Usuario registrado con Google",
            user: { id: newUser[0].user_id, name: newUser[0].full_name, email: newUser[0].email }
        });

    } catch (err) {
        console.error("Error crítico en googleAuth:", err.message);
        res.status(500).json({ error: "Error interno del servidor: " + err.message });
    }
};

/**
 * 4. OBTENER PERFIL
 * Retorna datos básicos y calcula la edad en tiempo real.
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

        // 🚩 VALIDACIÓN: Solo calculamos edad si la fecha existe
        const age = user.birth_date ? calculateAge(user.birth_date) : "No registrada";

        res.json({
            ...user,
            age,
            can_edit_birth_date: !user.birth_date // Permitimos editarla si está vacía
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * 5. ACTUALIZAR PERFIL
 * Permite al usuario completar o cambiar sus datos (como birth_date).
 */
const updateUserProfile = async (req, res) => {
    const { userId, birth_date, full_name } = req.body;

    // Validación preventiva
    if (!userId) {
        return res.status(400).json({ error: "El ID de usuario es obligatorio" });
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .update({ 
                full_name: full_name, 
                birth_date: birth_date,
                // Si la columna updated_at falla, puedes comentarla temporalmente
                updated_at: new Date().toISOString() 
            })
            .eq('user_id', userId)
            .select();

        if (error) {
            console.error("Error de Supabase:", error.message);
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado para actualizar" });
        }

        res.json({
            message: "Perfil actualizado correctamente",
            user: { id: data[0].user_id, name: data[0].full_name, email: data[0].email }
        });
    } catch (err) {
        console.error("❌ Error en el servidor (Update):", err.message);
        res.status(500).json({ error: "Error interno: " + err.message });
    }
};

module.exports = { signupUser, loginUser, getUserProfile, googleAuth, updateUserProfile };