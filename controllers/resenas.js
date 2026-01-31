
const ResenaModel = require("../models/resenas"); 
const resenaModel = new ResenaModel();
class ResenaController {
    async editarComentario(req, res) {
        const idComentario = req.params.idComentario;
        const { comentario } = req.body;
        const idUsuario = req.session.idUsuario;
    
        if (!idUsuario) {
            return res.status(403).send("Debes iniciar sesión para editar tu comentario.");
        }
    
        if (!comentario) {
            return res.status(400).send("El comentario no puede estar vacío.");
        }
    
        resenaModel.obtenerComentarioPorId(idComentario, (comentarioExistente) => {
            if (!comentarioExistente) {
                return res.status(404).send("Comentario no encontrado.");
            }
    
            if (comentarioExistente.id_usuario !== idUsuario) {
                return res.status(403).send("No puedes editar el comentario de otro usuario.");
            }
    
            resenaModel.actualizarComentario(idComentario, comentario, (result) => {
                if (result.affectedRows === 0) {
                    return res.status(500).send("Error al actualizar el comentario.");
                }
                res.redirect(`/resenas/${comentarioExistente.id_resena}`);
            });
        });
    }
    
    
    async calificarResena(req, res) {  
        const idResena = req.params.id;  
        const calificacion = req.body.calificacion;  // Calificación de 0.5 a 5.0  
        const idUsuario = req.session.idUsuario;  // El usuario debe haber iniciado sesión  
    
        if (!idUsuario) {  
            return res.render("calificar");  
        }  
    
        resenaModel.usuarioYaCalifico(idUsuario, idResena, (yaCalifico) => {  
            if (yaCalifico) {  
                // Si ya calificó, actualiza la calificación  
                resenaModel.actualizarCalificacion(idUsuario, idResena, calificacion, (result) => {  
                    res.redirect(`/resenas/${idResena}`);  // Redirigir después de calificar  
                });  
            } else {  
                // Si no calificación previa, guarda una nueva  
                resenaModel.guardarCalificacion(idUsuario, idResena, calificacion, (result) => {  
                    res.redirect(`/resenas/${idResena}`);  // Redirigir después de calificar  
                });  
            }  
        });  
    }
    async verDetalleResena(req, res) {
        const idResena = req.params.id;
    
        resenaModel.obtenerResenaPorId(idResena, (resena) => {
            if (!resena) {
                return res.status(404).send("Reseña no encontrada.");
            }
    
            resenaModel.obtenerPromedioCalificacion(idResena, (promedio) => {
                resenaModel.obtenerComentarios(idResena, (comentarios) => {
                    // Pasamos req.session a la vista                                                                
                    res.render("detalleResena", { resena, promedio, comentarios, session: req.session });
                });
            });
        });
    }
    

          

    // Agregar comentario a una reseña
    async agregarComentario(req, res) {
        const idResena = req.params.id;
        const { comentario } = req.body;
        const idUsuario = req.session.idUsuario;

        if (!idUsuario) {
            return res.status(403).send("Debes iniciar sesión para comentar.");
        }

        if (!comentario) {
            return res.status(400).send("El comentario no puede estar vacío.");
        }

        resenaModel.guardarComentario(idUsuario, idResena, comentario, (result) => {
            res.redirect(`/resenas/${idResena}`);
        });
    }

    // Editar un comentario
    async editarComentario(req, res) {
        const idComentario = req.params.idComentario;
        const { comentario } = req.body;
        const idUsuario = req.session.idUsuario;

        if (!idUsuario) {
            return res.status(403).send("Debes iniciar sesión para editar tu comentario.");
        }

        resenaModel.obtenerComentarioPorId(idComentario, (comentarioExistente) => {
            if (comentarioExistente.id_usuario !== idUsuario) {
                return res.status(403).send("No puedes editar el comentario de otro usuario.");
            }

            resenaModel.actualizarComentario(idComentario, comentario, (result) => {
                res.redirect(`/resenas/${comentarioExistente.id_resena}`);
            });
        });
    }

    // Eliminar un comentario
    async eliminarComentario(req, res) {
        const idComentario = req.params.idComentario;
        const idUsuario = req.session.idUsuario;

        if (!idUsuario) {
            return res.status(403).send("Debes iniciar sesión para eliminar tu comentario.");
        }

        resenaModel.obtenerComentarioPorId(idComentario, (comentarioExistente) => {
            if (comentarioExistente.id_usuario !== idUsuario) {
                return res.status(403).send("No puedes eliminar el comentario de otro usuario.");
            }

            resenaModel.eliminarComentario(idComentario, (result) => {
                res.redirect(`/resenas/${comentarioExistente.id_resena}`);
            });
        });
    }
    async eliminarResena(req, res) {
        const idResena = req.params.id;

        if (!req.session.es_admin) {
            return res.status(403).send("No tienes permisos para eliminar reseñas.");
        }

        resenaModel.eliminarResena(idResena, (result) => {
            if (result.affectedRows === 0) {
                return res.status(404).send("Reseña no encontrada.");
            }
            res.redirect("/resenas");
        });
    }

    // Mostrar el formulario de edición
    async mostrarFormularioEditar(req, res) {
        const idResena = req.params.id;
        resenaModel.obtenerResenaPorId(idResena, (resena) => {
            if (!resena) {
                return res.status(404).send("Reseña no encontrada.");
            }
            res.render("editarResena", { resena });
        });
    }

    // Actualizar la reseña
    async actualizarResena(req, res) {
        const idResena = req.params.id;
        const { titulo, contenido } = req.body;

        if (!titulo || !contenido) {
            return res.status(400).send("Todos los campos son obligatorios.");
        }

        resenaModel.actualizarResena(idResena, { titulo, contenido }, (result) => {
            if (result.affectedRows === 0) {
                return res.status(404).send("Reseña no encontrada.");
            }
            res.redirect(`/resenas`);
        });
    }
    async guardarResena(req, res) {
        const { titulo, contenido } = req.body;
        const autor_id = req.session.idUsuario;

        if (!req.session.es_admin) {
            return res.status(403).send("No tienes permisos para crear reseñas.");
        }

        if (!titulo || !contenido) {
            return res.status(400).send({ error: "Todos los campos son obligatorios." });
        }

        // Capturar los archivos subidos
        const miniatura = req.files['miniatura'] ? req.files['miniatura'][0].filename : null;
        const video = req.files['video'] ? req.files['video'][0].filename : null;

        resenaModel.guardarResena({ titulo, contenido, autor_id, miniatura, video }, (result) => {
            res.redirect("/resenas");
        });
    }

    async listarResenas(req, res) {
        const es_admin = req.session.es_admin;
        const pagina = parseInt(req.query.pagina) || 1; // Página actual
        const limit = 9; // Número de reseñas por página
        const offset = (pagina - 1) * limit; // Calcular el offset
        const filtro = req.query.filtro || 'recientes'; // Filtro de la query
        const busqueda = req.query.buscar || ''; // Obtener el término de búsqueda
        
        // Contar reseñas con el término de búsqueda
        resenaModel.contarResenas(busqueda, (total) => {
            const totalPaginas = Math.ceil(total / limit);
            
            // Listar reseñas aplicando búsqueda y paginación
            resenaModel.listarResenasConPaginacion(busqueda, limit, offset, filtro, (resenas) => {
                res.render("resenas", { 
                    resenas, 
                    es_admin, 
                    pagina, 
                    totalPaginas, 
                    filtro, 
                    buscar: busqueda // Pasar el término de búsqueda a la vista
                });
            });
        });
    }
    

    
}

module.exports = ResenaController;


