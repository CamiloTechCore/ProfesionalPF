/**
 * Calcula la edad exacta basándose en BIRTH_DATE de la tabla 'users'.
 */
const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    // Ajuste si aún no ha cumplido años en el año actual
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
};

/**
 * Algoritmo de Proyección (Fase 4.4)
 * @param {number} P - Aporte mensual (Ahorro neto)
 * @param {number} i - Tasa mensual (Ej: 0.008 para 0.8% mensual)
 * @param {number} months - Tiempo en meses
 */
const calculateFutureValue = (P, i, months) => {
    if (i <= 0) return P * months; // Si no hay interés, es solo ahorro simple
    return P * (Math.pow(1 + i, months) - 1) / i;
};
module.exports = { calculateAge, calculateFutureValue };