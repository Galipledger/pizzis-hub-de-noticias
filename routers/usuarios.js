
const express = require("express");
const router = express.Router();
const usercontroller = require("../controllers/usuario");
const Usercontroller = new usercontroller();

router.get("/usuarios", Usercontroller.listarusuarios);
router.get("/usuario/:id", Usercontroller.editarusuariio);
router.post("/usuario", Usercontroller.guardarusuario);

router.get('/login', Usercontroller.mostrarFormulario);
router.post('/login', Usercontroller.validarFormulario);

router.get('/logout', Usercontroller.cerrarSesion);
router.get("/trucosytips",(req,res)=>{
    res.render("trucos")
})
router.get("/ayuda", (req, res) => res.render("ayuda"));
router.get("/politicas", (req, res) => res.render("politicaprivacidad"));
router.get("/contactos", (req, res) => res.render("contactanos"));
router.get("/home", (req, res) => res.render("index"));



module.exports = router;
