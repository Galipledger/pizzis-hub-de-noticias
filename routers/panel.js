const express = require("express")
const router = express.Router()           
const validarUsuario = require("../middleware/validarusuario")       
const Panelcontroller = require("../controllers/panel")
const panelcontroller = new Panelcontroller;

router.get("/home",validarUsuario, panelcontroller.mostrarlistado);
module.exports = router;