const express = require("express");
const router = express.Router();
const ResenaController = require("../controllers/resenas");
const { upload } = require("../controllers/noticias");
const resenaController = new ResenaController();
// Ruta para calificar una reseña
router.post("/resenas/comentario/editar/:idComentario", resenaController.editarComentario);
router.post('/resenas/:id/comentar', resenaController.agregarComentario);
router.post('/comentarios/:idComentario/eliminar', resenaController.eliminarComentario);
router.post("/resenas/:id/calificar", resenaController.calificarResena);

// Renderizar el formulario para crear una reseña
router.get("/resenas/crear", (req, res) => res.render("crearResena"));

// Guardar la reseña con las miniaturas y video
router.post("/resenas", upload.fields([
    { name: 'miniatura', maxCount: 1 },
    { name: 'fotoextra', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), resenaController.guardarResena);

// Listar todas las reseñas
router.get("/resenas", resenaController.listarResenas);

// Ver detalles de una reseña específica
router.get("/resenas/:id", resenaController.verDetalleResena);
// Ruta para eliminar una reseña
router.post("/resenas/:id/eliminar", resenaController.eliminarResena);

// Ruta para mostrar el formulario de edición
router.get("/resenas/:id/editar", resenaController.mostrarFormularioEditar);

// Ruta para actualizar una reseña
router.post("/resenas/:id/actualizar", resenaController.actualizarResena);

module.exports = router;
