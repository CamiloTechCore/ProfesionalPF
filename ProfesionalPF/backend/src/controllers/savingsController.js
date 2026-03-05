const supabase = require('../supabaseClient');

/**
 * Motor de Gestión de Metas: Crea o actualiza el objetivo de ahorro.
 * Impacta directamente en la tabla savings_metrics.
 */
const upsertSavingsGoal = async (req, res) => {
    const { user_id, goal_amount } = req.body;
    
    if (!user_id || !goal_amount) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    try {
        const { data, error } = await supabase
            .from('savings_metrics')
            .upsert({ 
                user_id, 
                goal_amount: parseFloat(goal_amount),
                // Añadimos estos campos con 0 para satisfacer el esquema actual
                annual_effective_rate: 0, 
                monthly_contribution: 0,
                is_active: true,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' })
            .select();

        if (error) throw error;
        res.status(200).json({ message: "¡Meta establecida!", data: data[0] });
    } catch (err) {
        res.status(500).json({ error: "Error en el motor de ahorros: " + err.message });
    }
};
/**
 * Obtener Meta: Recupera la configuración activa del usuario.
 * Si no existe, devuelve is_active: false para el frontend.
 */
const getSavingsGoal = async (req, res) => {
    const { userId } = req.params;
    try {
        const { data, error } = await supabase
            .from('savings_metrics')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .maybeSingle(); // Evita error si no encuentra registros

        if (error) throw error;

        // Respuesta limpia para el componente SavingsGoal.jsx
        res.json(data || { is_active: false });
    } catch (err) {
        res.status(500).json({ error: "Error al obtener meta: " + err.message });
    }
};

// SECCIÓN: EXPORTACIÓN (Corregida)
module.exports = { 
    getSavingsGoal, 
    upsertSavingsGoal 
};