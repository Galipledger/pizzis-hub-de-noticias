const validarusuario = (req, res, next) => {
    if (!req.session.idUsuario) {
        res.redirect("/login");
    }
    next();
}

module.exports = validarusuario;



