const conx = require("../database/db");

class NoticiasModel {
    async obtenerLikesDislikes(idNoticia) {
        const sql = `
            SELECT 
                SUM(CASE WHEN tipo = 'like' THEN 1 ELSE 0 END) AS likes,
                SUM(CASE WHEN tipo = 'dislike' THEN 1 ELSE 0 END) AS dislikes
            FROM likes_dislikes
            WHERE id_noticia = ?
        `;
        return new Promise((resolve, reject) => {
            conx.query(sql, [idNoticia], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }

    async obtenerVoto(idUsuario, idNoticia) {
        const sql = "SELECT * FROM likes_dislikes WHERE id_usuario = ? AND id_noticia = ?";
        return new Promise((resolve, reject) => {
            conx.query(sql, [idUsuario, idNoticia], (err, results) => {
                if (err) reject(err);
                resolve(results.length ? results[0] : null);
            });
        });
    }
    async actualizarVoto(idUsuario, idNoticia, tipo) {  
        const sql = "UPDATE likes_dislikes SET tipo = ? WHERE id_usuario = ? AND id_noticia = ?";  
        return new Promise((resolve, reject) => {  
            conx.query(sql, [tipo, idUsuario, idNoticia], (err, results) => {  
                if (err) reject(err);  
                resolve(results);  
            });  
        });  
    }
    async guardarVoto(idUsuario, idNoticia, tipo) {
        const sql = "INSERT INTO likes_dislikes (id_usuario, id_noticia, tipo) VALUES (?, ?, ?)";
        return new Promise((resolve, reject) => {
            conx.query(sql, [idUsuario, idNoticia, tipo], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    async actualizarComentario(idComentario, comentario) {
        const sql = "UPDATE comentarios SET comentario = ? WHERE id = ?";
        return new Promise((resolve, reject) => {
            conx.query(sql, [comentario, idComentario], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
    async obtenerComentarioPorId(idComentario) {
        const sql = "SELECT * FROM comentarios WHERE id = ?";
        return new Promise((resolve, reject) => {
            conx.query(sql, [idComentario], (err, results) => {
                if (err) reject(err);
                resolve(results.length ? results[0] : null);
            });
        });
    }

    
    async eliminarComentario(idComentario) {
        const sql = "DELETE FROM comentarios WHERE id = ?";
        return new Promise((resolve, reject) => {
            conx.query(sql, [idComentario], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
    async buscarPorTitulo(query, limit, offset) {
        const sql = `
            SELECT n.*, 
                   (SELECT COUNT(*) FROM likes_dislikes WHERE id_noticia = n.id AND tipo = 'like') AS likes,
                   (SELECT COUNT(*) FROM likes_dislikes WHERE id_noticia = n.id AND tipo = 'dislike') AS dislikes
            FROM noticias n
            WHERE titulo LIKE ?
            ORDER BY fecha_publicacion DESC 
            LIMIT ? OFFSET ?;
        `;
        return new Promise((resolve, reject) => {
            conx.query(sql, [`%${query}%`, limit, offset], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
    

    async guardarComentario(idNoticia, idUsuario, comentario) {
        const sql = "INSERT INTO comentarios (id_noticia, id_usuario, comentario) VALUES (?, ?, ?)";
        return new Promise((resolve, reject) => {
            conx.query(sql, [idNoticia, idUsuario, comentario], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    // Obtener comentarios de una noticia
    async obtenerComentarios(idNoticia) {
        const sql = `
            SELECT c.id, c.comentario, c.fecha_comentario, u.nombre 
            FROM comentarios c 
            JOIN usuarios u ON c.id_usuario = u.id
            WHERE c.id_noticia = ? ORDER BY c.fecha_comentario DESC
        `;
        return new Promise((resolve, reject) => {
            conx.query(sql, [idNoticia], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
        // Actualizar noticia
        async actualizar(id, datos) {
            const sql = "UPDATE noticias SET titulo = ?, contenido = ? WHERE id = ?";
            return new Promise((resolve, reject) => {
                conx.query(sql, [datos.titulo, datos.contenido, id], (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
            });
        }
    
        // Eliminar noticia
        async eliminar(id) {
            const sql = "DELETE FROM noticias WHERE id = ?";
            return new Promise((resolve, reject) => {
                conx.query(sql, [id], (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
            });
        }
    async obtener(id) {
        const sql = "SELECT * FROM noticias WHERE id = ?";
        return new Promise((resolve, reject) => {
            conx.query(sql, [id], (err, results) => {
                if (err) reject(err);
                if (results.length === 0) resolve(null);
                resolve(results[0]);
            });
        });
    }

    async guardar(datos) {
        const sql = "INSERT INTO noticias (titulo, contenido, autor_id, miniatura, foto_extra, video) VALUES (?, ?, ?, ?, ?, ?)";
        return new Promise((resolve, reject) => {
            conx.query(sql, [datos.titulo, datos.contenido, datos.autorId, datos.miniatura, datos.foto_extra, datos.video], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
    
    async listar(orden, limit, offset) {  
        const sql = `SELECT * FROM noticias ORDER BY fecha_publicacion ${orden} LIMIT ? OFFSET ?`;  
        return new Promise((resolve, reject) => {  
            conx.query(sql, [limit, offset], (err, results) => {  
                if (err) reject(err);  
                resolve(results);  
            });  
        });  
    }  
    
    // Nueva función para listar por likes
async listarPorLikes(orden, limit, offset) {
    const sql = `
        SELECT n.*, 
               (SELECT COUNT(*) FROM likes_dislikes WHERE id_noticia = n.id AND tipo = 'like') AS likes 
        FROM noticias n
        ORDER BY likes ${orden} 
        LIMIT ? OFFSET ?;
    `;
    return new Promise((resolve, reject) => {
        conx.query(sql, [limit, offset], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}

    
    
                                                                
    async contarNoticias(query) {  
        const sql = "SELECT COUNT(*) as count FROM noticias WHERE titulo LIKE ?";  
        return new Promise((resolve, reject) => {  
            conx.query(sql, [`%${query}%`], (err, results) => {  
                if (err) reject(err);  
                resolve(results[0].count);  
            });  
        });  
    }
}

module.exports = NoticiasModel;
