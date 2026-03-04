// Definición de estructura lógica para validación de entrada
const userSchema = {
    FULL_NAME: (name) => name && name.length <= 40,
    EMAIL: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    BIRTH_DATE: (date) => !isNaN(Date.parse(date))
};

module.exports = userSchema;