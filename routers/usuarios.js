
const express = require("express");
const router = express.Router();
const usercontroller = require("../controllers/usuario");
const Usercontroller = new usercontroller();
const esAdmin = (req, res, next) => {
  if (req.session && req.session.es_admin) {
      return next(); // El usuario es admin, continúa con la siguiente función
  }
  res.status(403).send('Acceso denegado'); // Usuario no autorizado
};

router.post("/banear", Usercontroller.banearUsuario);
router.post("/desbanear", Usercontroller.desbanearUsuario);

const isAuthenticated = (req, res, next) => {
  if (req.session.idUsuario) {
      return next();
  }
  res.redirect('/login');
};

// Ruta para mostrar el chat
router.get('/chat', isAuthenticated, (req, res) => {
  res.render('chat');
});

  
router.get("/usuarios",esAdmin ,Usercontroller.listarusuarios);
router.get("/usuario/:id", Usercontroller.editarusuariio);
router.post("/usuario", Usercontroller.guardarusuario);

router.get('/login', Usercontroller.mostrarFormulario);
router.post('/login', Usercontroller.validarFormulario);

router.get('/logout', Usercontroller.cerrarSesion);
router.get("/ayuda", (req, res) => res.render("ayuda",{ es_admin: req.session.es_admin }));
router.get("/politicas", (req, res) => res.render("politicaprivacidad",{ es_admin: req.session.es_admin }));
router.get("/contactos", (req, res) => res.render("contactanos",{ es_admin: req.session.es_admin }));
router.get("/home", (req, res) => res.render("index",{ es_admin: req.session.es_admin }));



module.exports = router;
