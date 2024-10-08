const express = require("express");
const router = express.Router();
const NoticiasController = require("../controllers/noticias");
const noticiasController = new NoticiasController();
const { upload } = require("../controllers/noticias");   
router.post("/noticias/:id/votar", noticiasController.votar);
router.get("/noticias", noticiasController.listarNoticias);                                                              
                                                    
router.post("/noticias/comentario/eliminar/:idComentario", noticiasController.eliminarComentario);
router.post("/noticias/comentario/editar/:idComentario", noticiasController.editarComentario);

router.get("/noticias/buscar", noticiasController.buscarNoticias);  

router.post("/noticias/:id/comentar", noticiasController.guardarComentario);                                              
router.get("/yavotaste",noticiasController.mostrarvotacion)


router.get('/noticias/crear', noticiasController.mostrarFormulario);
router.post('/noticias/crear', upload.fields([{ name: 'miniatura' }, { name: 'fotoextra' }, { name: 'video' }]), noticiasController.guardarNoticia);

router.get("/noticias/:id", noticiasController.mostrarNoticia);
router.get("/noticias", noticiasController.listarNoticias);
router.get("/noticias/:id/editar", noticiasController.mostrarFormularioEditar);  // Mostrar formulario para editar
router.post("/noticias/:id/editar", noticiasController.actualizarNoticia);        // Actualizar noticia
router.post("/noticias/:id/eliminar", noticiasController.eliminarNoticia);   



module.exports = router;
