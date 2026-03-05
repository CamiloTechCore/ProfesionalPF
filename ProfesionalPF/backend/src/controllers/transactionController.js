/* SECCIÓN: MOTOR DE SALDOS (getNetBalance) [cite: 10, 11] */

const supabase = require('../supabaseClient');

const getNetBalance = async (req, res) => {
    const { userId } = req.params;
    try {
        const { data: transactions, error } = await supabase
            .from('transactions')
            .select('amount_cop, transaction_type') // Columnas exactas del esquema
            .eq('user_id', userId);

        if (error) throw error;

        const summary = transactions.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount_cop) || 0;
            if (curr.transaction_type === 'income') acc.income += amount;
            else if (curr.transaction_type === 'expense') acc.expense += amount;
            return acc;
        }, { income: 0, expense: 0 });

        res.json({
            user_id: userId,
            total_income: summary.income,
            total_expenses: summary.expense,
            net_balance: summary.income - summary.expense
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};;

/* SECCIÓN: REGISTRO DE MOVIMIENTOS (addTransaction) [cite: 16] */
const addTransaction = async (req, res) => {
    // Desestructuramos user_id del cuerpo de la petición
    const { user_id, amount_cop, transaction_type, category, description, transaction_date } = req.body;

    // Validación de seguridad para evitar registros huérfanos
    if (!user_id) {
        return res.status(400).json({ error: "El user_id es obligatorio para registrar movimientos" });
    }

    try {
        const { data, error } = await supabase
            .from('transactions')
            .insert([{
                user_id, // UUID del usuario logueado
                amount_cop: parseFloat(amount_cop),
                transaction_type,
                category,
                description: description || `Registro de ${category}`,
                transaction_date: transaction_date || new Date().toISOString().split('T')[0]
            }])
            .select();

        if (error) throw error;
        res.status(201).json({ message: "Movimiento registrado con éxito", data: data[0] });
    } catch (err) {
        res.status(500).json({ error: "Error en el registro: " + err.message });
    }
};
const getCategorySummary = async (req, res) => {
    const { userId } = req.params;
    try {
        const { data: transactions, error } = await supabase
            .from('transactions')
            .select('category, amount_cop')
            .eq('user_id', userId)
            .eq('transaction_type', 'expense');

        if (error) throw error;

        const summary = transactions.reduce((acc, curr) => {
            const cat = curr.category || 'Otros';
            acc[cat] = (acc[cat] || 0) + parseFloat(curr.amount_cop);
            return acc;
        }, {});

        const formattedData = Object.keys(summary).map(key => ({
            name: key,
            value: summary[key]
        }));

        res.json(formattedData);
    } catch (err) {
        res.status(500).json({ error: "Error en Motor de Resumen: " + err.message });
    }
};

/**
 * Motor de Historial: Obtiene todos los movimientos para el listado y el PDF.
 * Resuelve el error 404 detectado en la consola.
 */
const getTransactionHistory = async (req, res) => {
    const { userId } = req.params;
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*') // Traemos todos los campos para el detalle
            .eq('user_id', userId)
            .order('transaction_date', { ascending: false }); // Orden cronológico inverso

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener historial: " + err.message });
    }
};



module.exports = { getNetBalance, addTransaction, getCategorySummary, getTransactionHistory };