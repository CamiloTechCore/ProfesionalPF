const supabase = require('../config/supabase');

const createTransaction = async (req, res) => {
  const { USER_ID, AMOUNT_COP, TRANSACTION_TYPE, CATEGORY, TRANSACTION_DATE, DESCRIPTION } = req.body;

  try {
    const { data, error } = await supabase
      .from('TRANSACTIONS')
      .insert([{
        USER_ID,
        AMOUNT_COP: parseFloat(AMOUNT_COP),
        TRANSACTION_TYPE,
        CATEGORY,
        TRANSACTION_DATE,
        DESCRIPTION: DESCRIPTION || `Registro de ${CATEGORY}`
      }])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: "Transacción guardada en el motor financiero",
      transaction: data[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/**
 * Motor de Saldos: Calcula el balance neto del usuario.
 */
const getNetBalance = async (req, res) => {
    const { userId } = req.params;

    try {
        // 1. Obtener todos los movimientos del usuario
        const { data: transactions, error } = await supabase
            .from('transactions')
            .select('amount, type')
            .eq('user_id', userId);

        if (error) throw error;

        // 2. Ejecutar el cálculo dinámico
        const balance = transactions.reduce((acc, current) => {
            return current.type === 'income' 
                ? acc + parseFloat(current.amount) 
                : acc - parseFloat(current.amount);
        }, 0);

        res.json({
            user_id: userId,
            net_balance: balance,
            total_transactions: transactions.length,
            currency: 'COP'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Registro de nuevo movimiento (Ingreso/Gasto)
 */
const addTransaction = async (req, res) => {
    const { user_id, amount_cop, transaction_type, category, description, transaction_date } = req.body;

    try {
        const { data, error } = await supabase
            .from('transactions')
            .insert([{
                user_id,
                amount_cop,
                transaction_type,
                category,
                description,
                transaction_date: transaction_date || new Date().toISOString().split('T')[0]
            }])
            .select();

        if (error) throw error;
        res.status(201).json({ message: "Movimiento registrado", data: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createTransaction, getNetBalance , addTransaction };