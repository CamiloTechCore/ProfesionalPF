const supabase = require('../supabaseClient');

/**
 * Motor de Gestión de Metas: Crea o actualiza el objetivo de ahorro.
 * Impacta directamente en la tabla savings_metrics.
 */
const upsertSavingsGoal = async (req, res) => {
    const { 
        user_id, 
        goal_name, 
        goal_amount, 
        annual_effective_rate, 
        investment_type,
        monthly_contribution 
    } = req.body;

    // Validación estricta para evitar errores de restricción NOT NULL
    if (!user_id || !goal_name || !goal_amount) {
        return res.status(400).json({ error: "Faltan datos obligatorios (Usuario, Nombre o Monto)" });
    }

    try {
        const { data, error } = await supabase
            .from('savings_metrics')
            .insert([
                { 
                    user_id, 
                    goal_name,
                    investment_type: investment_type || 'Neo banco',
                    goal_amount: parseFloat(goal_amount),
                    annual_effective_rate: parseFloat(annual_effective_rate) || 0,
                    monthly_contribution: parseFloat(monthly_contribution) || 0,
                    is_active: true,
                    updated_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) throw error;
        res.status(201).json({ message: "Meta registrada con éxito", data: data[0] });
    } catch (err) {
        // Aquí capturamos el error 500 que ves en consola
        res.status(500).json({ error: "Error en el motor de ahorros: " + err.message });
    }
};

/**
 * getSavingsGoals: Obtiene todas las metas del usuario.
 */
const getSavingsGoal = async (req, res) => {
    const { userId } = req.params;
    try {
        const { data, error } = await supabase
            .from('savings_metrics')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createSavingsGoal = async (req, res) => {
    const { user_id, goal_amount, goal_name, investment_type, annual_effective_rate } = req.body;
    try {
        const { data, error } = await supabase
            .from('savings_metrics')
            .insert([{ 
                user_id, 
                goal_name,
                investment_type,
                goal_amount: parseFloat(goal_amount),
                annual_effective_rate: parseFloat(annual_effective_rate),
                is_active: true
            }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const withdrawFromGoal = async (req, res) => {
    const { userId, metricId, amount, goalName } = req.body;
    try {
        // 1. Restar el monto de la meta en savings_metrics
        const { data: goal, error: fetchError } = await supabase
            .from('savings_metrics')
            .select('goal_amount')
            .eq('metric_id', metricId)
            .single();

        if (fetchError) throw fetchError;

        const newAmount = parseFloat(goal.goal_amount) - parseFloat(amount);

        await supabase
            .from('savings_metrics')
            .update({ goal_amount: newAmount })
            .eq('metric_id', metricId);

        // 2. Registrar la transacción negativa (Salida de la meta)
        // Se registra como 'expense' para el historial, pero afecta el balance
        await supabase
            .from('transactions')
            .insert([{
                user_id: userId,
                category: 'Retiro de Inversión',
                description: `Retiro de: ${goalName}`,
                amount_cop: parseFloat(amount),
                transaction_type: 'expense', // Registro negativo solicitado
                transaction_date: new Date().toISOString()
            }]);

        res.status(200).json({ message: "Retiro procesado con éxito" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const depositToGoal = async (req, res) => {
    const { userId, metricId, amount, goalName } = req.body;
    try {
        // 1. Obtener monto actual de la meta
        const { data: goal } = await supabase.from('savings_metrics').select('goal_amount').eq('metric_id', metricId).single();
        
        // 2. Sumar el nuevo aporte
        const newTotal = parseFloat(goal.goal_amount) + parseFloat(amount);
        await supabase.from('savings_metrics').update({ goal_amount: newTotal }).eq('metric_id', metricId);

        // 3. Crear transacción negativa en el historial
        await supabase.from('transactions').insert([{
            user_id: userId,
            category: 'Inversión E.A.',
            description: `Aporte a: ${goalName}`,
            amount_cop: parseFloat(amount),
            transaction_type: 'expense', // Se resta del disponible
            transaction_date: new Date().toISOString()
        }]);

        res.status(200).json({ message: "Aporte exitoso" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// SECCIÓN: EXPORTACIÓN (Corregida)
module.exports = { 
    getSavingsGoal, 
    upsertSavingsGoal,
    createSavingsGoal,
    withdrawFromGoal,
    depositToGoal
};