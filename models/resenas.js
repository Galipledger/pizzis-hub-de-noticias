const conx = require("../database/db"); 
class ResenaModel {
  // Método para contar el total de reseñas con búsqueda
contarResenas(busqueda, callback) {
    const sql = "SELECT COUNT(*) AS total FROM resenas WHERE titulo LIKE ?";
    const terminoBusqueda = '%' + busqueda + '%';
    conx.query(sql, [terminoBusqueda], (err, result) => {
        if (err) throw err;
        callback(result[0].total);
    });
}

// Método para listar reseñas con paginación y búsqueda
listarResenasConPaginacion(busqueda, limit, offset, filtro, callback) {
    let orderClause = 'ORDER BY r.fecha_publicacion DESC';
    if (filtro === 'antiguas') {
        orderClause = 'ORDER BY r.fecha_publicacion ASC';
    } else if (filtro === 'mas_estrellas') {
        orderClause = 'ORDER BY promedio_calificacion DESC';
    } else if (filtro === 'menos_estrellas') {
        orderClause = 'ORDER BY promedio_calificacion ASC';
    }

    const sql = `
        SELECT r.*, u.nombre AS autor, r.fecha_publicacion, 
               (SELECT AVG(c.calificacion) FROM calificaciones c WHERE c.id_resena = r.id) AS promedio_calificacion
        FROM resenas r
        JOIN usuarios u ON r.autor_id = u.id
        WHERE r.titulo LIKE ?
        ${orderClause}
        LIMIT ? OFFSET ?;
    `;
    const terminoBusqueda = '%' + busqueda + '%';
    conx.query(sql, [terminoBusqueda, limit, offset], (err, results) => {
        if (err) throw err;
        callback(results);
    });
}



    actualizarComentario(idComentario, nuevoComentario, callback) {
        const sql = "UPDATE comentarios SET comentario = ? WHERE id = ?";
        conx.query(sql, [nuevoComentario, idComentario], (err, result) => {
            if (err) throw err;
            callback(result);
        });
    }
    
    guardarComentario(idUsuario, idResena, comentario, callback) {
        const sql = "INSERT INTO comentarios (id_usuario, id_resena, comentario) VALUES (?, ?, ?)";
        conx.query(sql, [idUsuario, idResena, comentario], (err, result) => {
            if (err) throw err;
            callback(result);
        });
    }

    // Obtener comentarios de una reseña
    obtenerComentarios(idResena, callback) {
        const sql = "SELECT c.*, u.nombre AS autor FROM comentarios c JOIN usuarios u ON c.id_usuario = u.id WHERE c.id_resena = ? ORDER BY c.fecha_comentario DESC";
        conx.query(sql, [idResena], (err, results) => {
            if (err) throw err;
            callback(results);
        });
    }

    // Obtener un comentario por su ID
    obtenerComentarioPorId(idComentario, callback) {
        const sql = "SELECT * FROM comentarios WHERE id = ?";
        conx.query(sql, [idComentario], (err, result) => {
            if (err) throw err;
            callback(result[0]);
        });
    }

  

    // Eliminar comentario
    eliminarComentario(idComentario, callback) {
        const sql = "DELETE FROM comentarios WHERE id = ?";
        conx.query(sql, [idComentario], (err, result) => {
            if (err) throw err;
            callback(result);
        });
    }
    obtenerPromedioCalificacion(idResena, callback) {
        const sql = "SELECT AVG(calificacion) AS promedio FROM calificaciones WHERE id_resena = ?";
        conx.query(sql, [idResena], (err, result) => {
            if (err) throw err;
            callback(result[0].promedio);
        });
    }

    // Método para guardar la calificación de un usuario
    guardarCalificacion(idUsuario, idResena, calificacion, callback) {
        const sql = "INSERT INTO calificaciones (id_usuario, id_resena, calificacion) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE calificacion = ?";
        conx.query(sql, [idUsuario, idResena, calificacion, calificacion], (err, result) => {
            if (err) throw err;                                                                            
            callback(result);
        });
    }
    // Método para actualizar la calificación de un usuario  
actualizarCalificacion(idUsuario, idResena, calificacion, callback) {  
    const sql = "UPDATE calificaciones SET calificacion = ? WHERE id_usuario = ? AND id_resena = ?";  
    conx.query(sql, [calificacion, idUsuario, idResena], (err, result) => {  
        if (err) throw err;                                                                            
        callback(result);  
    });  
}

    // Método para verificar si el usuario ya calificó una reseña
    usuarioYaCalifico(idUsuario, idResena, callback) {
        const sql = "SELECT calificacion FROM calificaciones WHERE id_usuario = ? AND id_resena = ?";
        conx.query(sql, [idUsuario, idResena], (err, result) => {
            if (err) throw err;
            callback(result.length > 0);  // Si hay resultados, ya calificó
        });
    }
    eliminarResena(idResena, callback) {
        const sql = "DELETE FROM resenas WHERE id = ?";
        conx.query(sql, [idResena], (err, result) => {
            if (err) throw err;
            callback(result);
        });
    }

    actualizarResena(idResena, datos, callback) {
        const sql = "UPDATE resenas SET titulo = ?, contenido = ? WHERE id = ?";
        conx.query(sql, [datos.titulo, datos.contenido, idResena], (err, result) => {
            if (err) throw err;
            callback(result);
        });
    }
    guardarResena(datos, callback) {
        let sql = "INSERT INTO resenas(titulo, contenido, autor_id, miniatura, video) VALUES(?, ?, ?, ?, ?)";
        conx.query(sql, [datos.titulo, datos.contenido, datos.autor_id, datos.miniatura, datos.video], (err, results) => {
            if (err) throw err;
            callback(results);
        });
    }

    listarResenas(callback) {
        let sql = `
            SELECT r.*, u.nombre AS autor, r.fecha_publicacion, 
                   (SELECT AVG(c.calificacion) FROM calificaciones c WHERE c.id_resena = r.id) AS promedio_calificacion
            FROM resenas r 
            JOIN usuarios u ON r.autor_id = u.id
            ORDER BY r.fecha_publicacion DESC
        `;
        conx.query(sql, [], (err, results) => {
            if (err) throw err;
            callback(results);
        });
    }
    

    obtenerResenaPorId(idResena, callback) {
        let sql = `
            SELECT r.*, u.nombre AS autor, r.fecha_publicacion 
            FROM resenas r 
            JOIN usuarios u ON r.autor_id = u.id
            WHERE r.id = ?
        `;
        conx.query(sql, [idResena], (err, result) => {
            if (err) throw err;
            callback(result[0]);  
        });
    }
}

module.exports = ResenaModel;
