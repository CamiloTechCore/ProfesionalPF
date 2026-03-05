const supabase = require('../config/supabase');
const { getLatestTRM } = require('../services/currencyService');

const updateIncomeConfig = async (req, res) => {
    // El USER_ID debe venir del token de sesión (JWT) en el futuro
    const { USER_ID, FREQUENCY_TYPE, CUTOFF_DAY_1, CUTOFF_DAY_2, CUTOFF_DAY_3 } = req.body;

    try {
        const { data, error } = await supabase
            .from('INCOME_CONFIG')
            .upsert({ 
                USER_ID, 
                FREQUENCY_TYPE, 
                CUTOFF_DAY_1, 
                CUTOFF_DAY_2, 
                CUTOFF_DAY_3,
                UPDATED_AT: new Date()
            })
            .select();

        if (error) throw error;

        res.status(200).json({
            message: "Configuración de ingresos actualizada correctamente.",
            config: data[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getFinancialStatus = async (req, res) => {
    try {
        const trmInfo = await getLatestTRM();
        
        // Ejemplo de conversión dinámica COP -> USD
        // Supongamos que el saldo del usuario llega en el body o query
        const saldoCOP = parseFloat(req.query.saldo) || 0;
        const saldoUSD = (saldoCOP / trmInfo.valor).toFixed(2);

        res.json({
            trm: trmInfo.valor,
            tendencia: trmInfo.tendencia, // Indicador Alza/Baja
            fecha_sincronizacion: trmInfo.fecha,
            conversion: {
                saldo_usd: saldoUSD,
                tasa: trmInfo.valor
            }
        });
    } catch (err) {
        res.status(500).json({ error: "No se pudo sincronizar la TRM" });
    }
};

module.exports = { updateIncomeConfig , getFinancialStatus };