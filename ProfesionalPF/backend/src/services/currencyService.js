const axios = require('axios');

/**
 * Servicio para obtener la TRM del dólar (USD/COP).
 * Implementa la sincronización con servicios financieros.
 */
const getLatestTRM = async () => {
    try {
        // Usamos una API pública para la TRM de Colombia
        const response = await axios.get('https://api.v0.dolarapi.com/com/v1/dolares/oficial');
        
        return {
            valor: response.data.valor, // Ejemplo: 3950.50
            fecha: response.data.fechaActualizacion,
            moneda: 'USD',
            // Simulamos tendencia comparando con un valor base (o podrías guardarlo en DB)
            tendencia: response.data.valor > 3900 ? 'ALZA' : 'BAJA' // Lógica de tendencia
        };
    } catch (error) {
        console.error("Error consultando TRM:", error.message);
        // Valor de respaldo (fallback) en caso de caída del servicio
        return { valor: 4000, tendencia: 'ESTABLE', error: true };
    }
};

module.exports = { getLatestTRM };