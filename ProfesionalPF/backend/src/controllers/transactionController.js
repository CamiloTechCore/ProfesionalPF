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

module.exports = { createTransaction };