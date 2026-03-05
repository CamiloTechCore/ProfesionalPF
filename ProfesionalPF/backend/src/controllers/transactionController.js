/* SECCIÓN: MOTOR DE SALDOS (getNetBalance) [cite: 10, 11] */
const getNetBalance = async (req, res) => {
    const { userId } = req.params;
    try {
        const { data: transactions, error } = await supabase
            .from('transactions')
            .select('amount_cop, transaction_type') // Nombres de columna reales
            .eq('user_id', userId);

        if (error) throw error;

        // Desglose para las tarjetas de Ingresos y Gastos
        const summary = transactions.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount_cop);
            if (curr.transaction_type === 'income') acc.income += amount;
            else if (curr.transaction_type === 'expense') acc.expense += amount;
            return acc;
        }, { income: 0, expense: 0 });

        res.json({
            user_id: userId,
            total_income: summary.income,
            total_expense: summary.expense,
            net_balance: summary.income - summary.expense
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* SECCIÓN: REGISTRO DE MOVIMIENTOS (addTransaction) [cite: 16] */
const addTransaction = async (req, res) => {
    const { user_id, amount_cop, transaction_type, category, description, transaction_date } = req.body;
    try {
        const { data, error } = await supabase
            .from('transactions')
            .insert([{
                user_id,
                amount_cop: parseFloat(amount_cop),
                transaction_type,
                category,
                description,
                transaction_date: transaction_date || new Date().toISOString().split('T')[0]
            }])
            .select();

        if (error) throw error;
        res.status(201).json({ message: "Éxito", data: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getNetBalance, addTransaction, getCategorySummary };