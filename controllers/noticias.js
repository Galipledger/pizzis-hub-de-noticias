const NoticiasModel = require("../models/noticias");
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'video/mp4'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido'));
        }
    }
});

module.exports.upload = upload.fields([
    { name: 'miniatura', maxCount: 1 }, 
    { name: 'fotoextra', maxCount: 1 }, 
    { name: 'video', maxCount: 1 }
]);

const noticiasModel = new NoticiasModel();

class NoticiasController {
    async votar(req, res) {
        const { id } = req.params; 
        const { tipo } = req.body; 
        const idUsuario = req.session.idUsuario;

        if (!idUsuario) {
            return res.render("comentar")
        }

        try {
            // Verificar si el usuario ya votó
            const votoExistente = await noticiasModel.obtenerVoto(idUsuario, id);
            if (votoExistente) {
                return res.render("yavotaste")
            }

            // Registrar el voto
            await noticiasModel.guardarVoto(idUsuario, id, tipo);
            res.redirect(`/noticias/${id}`);
        } catch (error) {
            res.status(500).send("Error al procesar el voto.");
        }
    }
    async editarComentario(req, res) {
        const { idComentario } = req.params;
        const { comentario } = req.body;
        const idUsuario = req.session.idUsuario;

  
        const comentarioExistente = await noticiasModel.obtenerComentarioPorId(idComentario);
        if (!comentarioExistente || comentarioExistente.id_usuario !== idUsuario) {
            return res.status(403).send("No tienes permiso para editar este comentario.");
        }

        // Actualizar el comentario en la base de datos
        await noticiasModel.actualizarComentario(idComentario, comentario);
        res.redirect(`/noticias/${comentarioExistente.id_noticia}`);
    }

    async eliminarComentario(req, res) {
        const { idComentario } = req.params;
        const idUsuario = req.session.idUsuario; 
        console.log(idComentario)
        console.log("hola")

        try {
          
            const comentario = await noticiasModel.obtenerComentarioPorId(idComentario);
            if (comentario && comentario.id_usuario === idUsuario) {
                await noticiasModel.eliminarComentario(idComentario);
                res.redirect(`/noticias/${comentario.id_noticia}`);
            } else {
                res.status(403).send("No tienes permiso para eliminar este comentario.");
            }
        } catch (error) {
            res.status(500).send("Error al eliminar el comentario");
        }
    }
    async buscarNoticias(req, res) {  
        const { query, page = 1 } = req.query;  
        const limit = 9;  
        const offset = (page - 1) * limit;  
    
        const noticias = await noticiasModel.buscarPorTitulo(query, limit, offset);  
        const totalNoticias = await noticiasModel.contarNoticias(query); 
    
        res.render("listadonoticias", {  
            noticias,  
            es_admin: req.session.es_admin,  
            query,  
            currentPage: parseInt(page), 
            totalPages: Math.ceil(totalNoticias / limit)
        });  
    }
    
    
    
        //  editar noticia
        async mostrarFormularioEditar(req, res) {
            const id = req.params.id;
            const noticia = await noticiasModel.obtener(id);
            if (noticia && req.session.es_admin) {
                res.render("editarnoticia", { noticia });
            } else {
                res.status(404).render("error", { message: "Noticia no encontrada" });
            }
        }
    
        // Actualizar noticia
        async actualizarNoticia(req, res) {
            if (req.session.es_admin) {
                const { id } = req.params;
                const { titulo, contenido } = req.body;
                await noticiasModel.actualizar(id, { titulo, contenido });
                res.redirect("/noticias");
            } else {
                res.status(403).send("Acceso denegado");
            }
        }
    
        // Eliminar noticia
        async eliminarNoticia(req, res) {
            if (req.session.es_admin) {
                const { id } = req.params;
                await noticiasModel.eliminar(id);
                res.redirect("/noticias");
            } else {
                res.status(403).send("Acceso denegado");
            }
        }
        async mostrarNoticia(req, res) {
            const id = req.params.id;
            const noticia = await noticiasModel.obtener(id);
            const comentarios = await noticiasModel.obtenerComentarios(id);
            const likesDislikes = await noticiasModel.obtenerLikesDislikes(id); // Nueva función
    
            if (noticia) {
                res.render("detalleNoticia", { 
                    noticia, 
                    comentarios, 
                    nombreUsuario: req.session.nombreUsuario,
                    likesDislikes // Pasar el conteo de likes y dislikes
                });
            } else {
                res.status(404).render("error", { message: "Noticia no encontrada" });
            }
        }
        
        async guardarComentario(req, res) {
            const { id } = req.params;
            const { comentario } = req.body;
            const idUsuario = req.session.idUsuario;
    
            if (idUsuario && comentario) {
                await noticiasModel.guardarComentario(id, idUsuario, comentario);
                res.redirect(`/noticias/${id}`);
            } else {
                res.status(400).send("Error al guardar el comentario");
            }
        }
        mostrarvotacion(req,res){
            res.render("yavotaste")
           }
    mostrarFormulario(req, res) {
        if (req.session.es_admin) {
            res.render("crearnoticia");
        } else {
            res.render("acessodenegado")
        }
    }

    async guardarNoticia(req, res) {
        if (req.session.es_admin) {
            const { titulo, contenido } = req.body;
            const miniatura = req.files['miniatura'] ? req.files['miniatura'][0].filename : null;
            const fotoextra = req.files['fotoextra'] ? req.files['fotoextra'][0].filename : null;  // Añadido
            const video = req.files['video'] ? req.files['video'][0].filename : null;
            const autorId = req.session.idUsuario;
    
            try {
                await noticiasModel.guardar({ titulo, contenido, autorId, miniatura, fotoextra, video });  // Añadido fotoextra
                res.redirect("/noticias");
            } catch (error) {
                res.status(500).send("Error al guardar la noticia");
            }
        } else {
            res.status(403).send("Acceso denegado");
        }
    }
    
    
    
    async listarNoticias(req, res) {
        const { order, query, page = 1, filtro } = req.query; // Agregamos 'filtro'
        const limit = 9; 
        const offset = (page - 1) * limit;
        
        let orden = 'DESC';
        if (order === 'asc') {
            orden = 'ASC';
        }
    
        let noticiasData;
        if (filtro === 'likes') {
            // Filtrar por más likes
            noticiasData = await noticiasModel.listarPorLikes(orden, limit, offset);
        } else {
            // Filtro por orden de fecha u otro criterio
            noticiasData = await noticiasModel.listar(orden, limit, offset);
        }
        
        const totalNoticias = await noticiasModel.contarNoticias(query || '');
        
        // Obtener likes y dislikes para cada noticia
        for (let noticia of noticiasData) {
            const likesDislikes = await noticiasModel.obtenerLikesDislikes(noticia.id);
            noticia.likes = likesDislikes.likes || 0;
            noticia.dislikes = likesDislikes.dislikes || 0;
        }
    
        res.render("listadonoticias", { 
            noticias: noticiasData,
            es_admin: req.session.es_admin,
            query: query || '',
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalNoticias / limit)
        });
    }
    
    
    
}

module.exports = NoticiasController;


module.exports.upload = upload;

