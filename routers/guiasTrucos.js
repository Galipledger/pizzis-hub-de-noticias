const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const GuiaTrucosController = require("../controllers/guiaTrucosController");
const guiaTrucosController = new GuiaTrucosController();
router.post("/guias-trucos/:id/comentarios", verificarSesion, guiaTrucosController.agregarComentario);
router.get("/guias-trucos/:id/comentarios", guiaTrucosController.listarComentarios);
router.post("/guias-trucos/:id_guia/comentarios/:id_comentario/borrar", verificarSesion, guiaTrucosController.borrarComentario);
router.post("/guias-trucos/:id_guia/comentarios/:id_comentario/editar", verificarSesion, guiaTrucosController.actualizarComentario);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads"); // Carpeta de destino de las imágenes y videos
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

function verificarSesion(req, res, next) {
    if (req.session.idUsuario) {
        next();
    } else {
        res.redirect("/login"); // Redirige al login si no ha iniciado sesión
    }
}

router.get("/trucosytips", guiaTrucosController.listarGuiaTrucos);
router.get("/trucosytips/crear", guiaTrucosController.mostrarFormularioCrear);
router.get("/trucosytips/editar/:id", verificarSesion, guiaTrucosController.editarGuiaTruco);
router.post("/trucosytips/editar/:id", verificarSesion, upload.fields([{ name: 'miniatura' }, { name: 'video' }]), guiaTrucosController.actualizarGuiaTruco);
router.post("/trucosytips/borrar/:id", verificarSesion, guiaTrucosController.borrarGuiaTruco);
router.post("/guias-trucos/:id/corazon", verificarSesion, guiaTrucosController.darCorazon);
router.post("/guias-trucos/:id/dislike", verificarSesion, guiaTrucosController.darDislike);
router.post("/guias-trucos/:id/enojo", verificarSesion, guiaTrucosController.darEnojo);
router.post("/guias-trucos/:id/sorpresa", verificarSesion, guiaTrucosController.darSorpresa);


router.get("/trucosytips", guiaTrucosController.listarGuiaTrucos);
router.get("/trucosytips/crear", verificarSesion, guiaTrucosController.mostrarFormularioCrear);
router.post("/trucosytips/crear", verificarSesion, upload.fields([{ name: 'miniatura' }, { name: 'video' }]), guiaTrucosController.guardarGuiaTruco);
router.get("/guias-trucos/:id", guiaTrucosController.mostrarGuiaTruco);
router.get("/trucosytips/buscar", guiaTrucosController.buscarGuiaTruco);


module.exports = router;
