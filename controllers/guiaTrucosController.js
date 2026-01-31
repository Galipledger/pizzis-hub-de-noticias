const GuiasTrucosModel = require("../models/guiasTrucos");

class GuiaTrucosController {
    

    async agregarComentario(req, res) {
        const { id } = req.params;
        const idUsuario = req.session.idUsuario;
        const { contenido } = req.body;

        if (!contenido) {
            return res.status(400).send({ error: "El contenido del comentario no puede estar vacío." });
        }

        await GuiasTrucosModel.agregarComentario({ id_guia: id, id_usuario: idUsuario, contenido });
        res.redirect(`/guias-trucos/${id}`);
    }

    async listarComentarios(req, res) {
        const { id } = req.params;
        const comentarios = await GuiasTrucosModel.listarComentarios(id);
        res.render("comentarios", { comentarios });
    }

    async borrarComentario(req, res) {
        const { id_comentario, id_guia } = req.params;
        await GuiasTrucosModel.borrarComentario(id_comentario);
        res.redirect(`/guias-trucos/${id_guia}`);
    }

    async actualizarComentario(req, res) {
        const { id_comentario, id_guia } = req.params;
        const { contenido } = req.body;

        if (!contenido) {
            return res.status(400).send({ error: "El contenido del comentario no puede estar vacío." });
        }

        await GuiasTrucosModel.actualizarComentario(id_comentario, contenido);
        res.redirect(`/guias-trucos/${id_guia}`);
    }


    async darSorpresa(req, res) {
        const { id } = req.params;
        const idUsuario = req.session.idUsuario;
        const result = await GuiasTrucosModel.actualizarReacciones(id, 'surprise', idUsuario);
        if (result.alreadyExists) {
            return res.render("yareacionaste")
        }
        res.redirect(`/guias-trucos/${id}`);
    }


    async darCorazon(req, res) {
        const { id } = req.params;
        const idUsuario = req.session.idUsuario;
        const result = await GuiasTrucosModel.actualizarReacciones(id, 'likes', idUsuario);
        if (result.alreadyExists) {
            return res.render("yareacionaste")
        }
        res.redirect(`/guias-trucos/${id}`);
    }

    async darDislike(req, res) {
        const { id } = req.params;
        const idUsuario = req.session.idUsuario;
        const result = await GuiasTrucosModel.actualizarReacciones(id, 'dislikes', idUsuario);
        if (result.alreadyExists) {
            return  res.render("yareacionaste")
        }
        res.redirect(`/guias-trucos/${id}`);
    }

    async darEnojo(req, res) {
        const { id } = req.params;
        const idUsuario = req.session.idUsuario;
        const result = await GuiasTrucosModel.actualizarReacciones(id, 'angry', idUsuario);
        if (result.alreadyExists) {
            return res.render("yareacionaste")
        }
        res.redirect(`/guias-trucos/${id}`);
    }




   async mostrarGuiaTruco(req, res) {
    const { id } = req.params;
    const guiaTruco = await GuiasTrucosModel.obtenerPorId(id);
    if (!guiaTruco) {
        return res.status(404).send("Guía o truco no encontrado.");
    }
    res.render("detalleGuiaTruco", { guiaTruco }); // Renderizar la vista de detalles
}




    async buscarGuiaTruco(req, res) {
        const es_admin = req.session.es_admin
        const idUsuario = req.session.idUsuario;
        const pagina = parseInt(req.query.pagina) || 1;
        const limit = 9;
        const offset = (pagina - 1) * limit;
        const filtro = req.query.filtro || 'mas_reciente';
        const busqueda = req.query.busqueda || '';

        // Contar guías con el término de búsqueda
        GuiasTrucosModel.contarGuiasTrucos(busqueda, (total) => {
            const totalPaginas = Math.ceil(total / limit);

            // Listar guías aplicando búsqueda y paginación
            GuiasTrucosModel.listarGuiasTrucosConPaginacion(busqueda, limit, offset, filtro, (guiasTrucos) => {
                res.render("listadoGuiasTrucos", {
                    guiasTrucos,
                    es_admin,
                    idUsuario,
                    pagina,
                    totalPaginas,
                    filtro,
                    busqueda
                });
            });
        });
    }

 
    async editarGuiaTruco(req, res) {
        try {
            // Obtén el ID de la guía/truco desde los parámetros de la URL
            const { id } = req.params;
    
            // Recupera la guía/truco desde la base de datos
            const guiaTruco = await GuiasTrucosModel.obtenerPorId(id);
    
            if (!guiaTruco) {
                return res.status(404).send("Guía o truco no encontrado");
            }
    
            // Renderiza la vista pasando la guía/truco a editar
            res.render("editarGuiaTruco", { guiaTruco });
        } catch (error) {
            console.error("Error al cargar la guía/truco para editar:", error);
            res.status(500).send("Error al cargar la guía/truco.");
        }
    }

    async actualizarGuiaTruco(req, res) {
        const idGuia = req.params.id;
        const idUsuario = req.session.idUsuario;
        const esAdmin = req.session.es_admin;
    
        const guia = await GuiasTrucosModel.obtenerPorId(idGuia);
    
        // Verificar si el usuario es el dueño o si es admin
        if (guia.id_usuario !== idUsuario && !esAdmin) {
            return res.status(403).send({ error: "No tienes permisos para actualizar esta guía." });
        }
    
        const { titulo, contenido } = req.body;
        const miniatura = req.files['miniatura'] ? req.files['miniatura'][0].filename : guia.miniatura; // Conservar miniatura anterior
        const video = req.files['video'] ? req.files['video'][0].filename : guia.video;
    
        await GuiasTrucosModel.actualizar(idGuia, { titulo, contenido, miniatura, video });
        res.redirect("/trucosytips");
    }

    
    async borrarGuiaTruco(req, res) {
        const idGuia = req.params.id;
        const idUsuario = req.session.idUsuario;
        const esAdmin = req.session.es_admin;

        const guia = await GuiasTrucosModel.obtenerPorId(idGuia);

        // Verificar si el usuario es el dueño o si es admin
        if (guia.id_usuario !== idUsuario && !esAdmin) {
            return res.status(403).send({ error: "No tienes permisos para borrar esta guía." });
        }

        await GuiasTrucosModel.borrar(idGuia);
        res.redirect("/trucosytips");
    }
   
    async mostrarGuiaTruco(req, res) {
        const { id } = req.params;
        const guiaTruco = await GuiasTrucosModel.obtenerPorId(id);
        if (!guiaTruco) {
            return res.status(404).send("Guía o truco no encontrado.");
        }
        const comentarios = await GuiasTrucosModel.listarComentarios(id);
        res.render("detalleGuiaTruco", { guiaTruco, comentarios, idUsuario: req.session.idUsuario }); // Asegúrate de pasar los comentarios e idUsuario a la vista
    }
    
    
    async listarGuiaTrucos(req, res) {
        const es_admin = req.session.es_admin;
        const idUsuario = req.session.idUsuario;
        const pagina = parseInt(req.query.pagina) || 1; // Página actual
        const limit = 9; // Número de guías por página
        const offset = (pagina - 1) * limit; // Calcular el offset
        const filtro = req.query.filtro || 'mas_reciente'; // Filtro de la query
        const busqueda = req.query.busqueda || ''; // Obtener el término de búsqueda

        // Contar guías con el término de búsqueda
        GuiasTrucosModel.contarGuiasTrucos(busqueda, (total) => {
            const totalPaginas = Math.ceil(total / limit);

            // Listar guías aplicando búsqueda y paginación
            GuiasTrucosModel.listarGuiasTrucosConPaginacion(busqueda, limit, offset, filtro, (guiasTrucos) => {
                res.render("listadoGuiasTrucos", {
                    guiasTrucos,
                    es_admin,
                    idUsuario, // Asegúrate de pasar idUsuario a la vista
                    pagina,
                    totalPaginas,
                    filtro,
                    busqueda // Pasar el término de búsqueda a la vista
                });
            });
        });
    }
        
    
    
    
    

    mostrarFormularioCrear(req, res) {
        // Verifica si el usuario ha iniciado sesión
        if (!req.session.idUsuario) {
            return res.redirect("/login"); // Redirige al login si no está autenticado
        }
        res.render("crearGuiaTruco");
    }

    async guardarGuiaTruco(req, res) {
        if (!req.session.idUsuario) {
            return res.status(403).send({ error: "Debes iniciar sesión para crear una guía o truco." });
        }

        const { titulo, contenido } = req.body;
        const idUsuario = req.session.idUsuario;
        
        // Extraer las rutas de los archivos subidos
        const miniatura = req.files['miniatura'] ? req.files['miniatura'][0].filename : null;
        const video = req.files['video'] ? req.files['video'][0].filename : null;

        if (!titulo || !contenido) {
            return res.status(400).send({ error: "Todos los campos son obligatorios." });
        }

        // Guardar en la base de datos
        await GuiasTrucosModel.guardar({ titulo, contenido, idUsuario, miniatura, video });
        res.redirect("/trucosytips");
    }
}

module.exports = GuiaTrucosController;

