const checkHabeasData = (req, res, next) => {
    const { ACCEPTED_POLICIES } = req.body;
    
    if (ACCEPTED_POLICIES !== true) {
        return res.status(403).json({
            error: "Debe aceptar la Política de Tratamiento de Datos (Ley 1581) para proceder."
        });
    }
    next();
};

module.exports = { checkHabeasData };