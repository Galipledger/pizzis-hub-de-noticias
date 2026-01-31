const conx = require("../database/db");

class GuiasTrucosModel {
   
    
       
    
    

    static agregarComentario(datos) {
        return new Promise((resolve, reject) => {                                                                
            const sql = "INSERT INTO comentarios (id_guia, id_usuario, contenido, fecha_comentario) VALUES (?, ?, ?, NOW())";
            conx.query(sql, [datos.id_guia, datos.id_usuario, datos.contenido], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    static listarComentarios(id_guia) {
        return new Promise((resolve, reject) => {                                                                                                                                                                                                                                                                                                                                                                  
            const sql = "SELECT c.*, u.nombre AS autor FROM comentarios c JOIN usuarios u ON c.id_usuario = u.id WHERE id_guia = ? ORDER BY  fecha_comentario DESC";
            conx.query(sql, [id_guia], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    static borrarComentario(id_comentario) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM comentarios WHERE id = ?";
            conx.query(sql, [id_comentario], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static actualizarComentario(id, contenido) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE comentarios SET contenido = ? WHERE id = ?";
            conx.query(sql, [contenido, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
    static actualizarReacciones(id, tipo, idUsuario) {
        return new Promise((resolve, reject) => {                                                               
            const checkSql = `SELECT * FROM user_reactions WHERE id_usuario = ? AND id_guia = ?`;
            conx.query(checkSql, [idUsuario, id], (err, results) => {
                if (err) return reject(err);

                if (results.length > 0) {
                    return resolve({ alreadyExists: true });
                } else {
                    // Actualizar las reacciones y registrar en user_reactions
                    const updateSql = `UPDATE guias_trucos SET ${tipo} = ${tipo} + 1 WHERE id = ?`;
                    conx.query(updateSql, [id], (err, result) => {
                        if (err) return reject(err);

                        const insertSql = `INSERT INTO user_reactions (id_usuario, id_guia, tipo) VALUES (?, ?, ?)`;
                        conx.query(insertSql, [idUsuario, id, tipo], (err, result) => {
                            if (err) return reject(err);
                            resolve({ alreadyExists: false });
                        });
                    });
                }
            });
        });
    }
    
   
    

    
        
    static listarGuiasTrucosConPaginacion(busqueda, limit, offset, filtro, callback) {
        let orderClause = 'ORDER BY gt.fecha_publicacion DESC';
        if (filtro === 'mas_antiguo') {
            orderClause = 'ORDER BY gt.fecha_publicacion ASC';
        } else if (filtro === 'autor_asc') {
            orderClause = 'ORDER BY u.nombre ASC';
        } else if (filtro === 'autor_desc') {
            orderClause = 'ORDER BY u.nombre DESC';
        }
    
        const sql = `
            SELECT gt.*, u.nombre AS autor
            FROM guias_trucos gt
            JOIN usuarios u ON gt.id_usuario = u.id
            WHERE gt.titulo LIKE ? OR u.nombre LIKE ?
            ${orderClause}
            LIMIT ? OFFSET ?
        `;
        const terminoBusqueda = '%' + busqueda + '%';
        conx.query(sql, [terminoBusqueda, terminoBusqueda, limit, offset], (err, results) => {
            if (err) throw err;
            callback(results);
        });
    }
    static buscarPorTituloOAutor(filtro, orden = 'reciente') {
        return new Promise((resolve, reject) => {
            let ordenSql = '';
            switch (orden) {
                case 'antiguo':
                    ordenSql = 'ORDER BY gt.fecha_publicacion ASC'; 
                    break;
                case 'autor_asc':
                    ordenSql = 'ORDER BY u.nombre ASC'; 
                    break;
                case 'autor_desc':
                    ordenSql = 'ORDER BY u.nombre DESC'; // Autor descendente
                    break;
                default:
                    ordenSql = 'ORDER BY gt.fecha_publicacion DESC'; // Más recientes primero
            }

            const sql = 
`SELECT gt.*, u.nombre AS autor
                FROM guias_trucos gt
                JOIN usuarios u ON gt.id_usuario = u.id
                WHERE gt.titulo LIKE ? OR u.nombre LIKE ?
                ${ordenSql}`
            ;
            const filtroSql = `%${filtro}%`; // Para buscar coincidencias parciales
            conx.query(sql, [filtroSql, filtroSql], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }    
        static contarGuiasTrucos(busqueda, callback) {
            const sql = `
                SELECT COUNT(*) AS total 
                FROM guias_trucos gt
                JOIN usuarios u ON gt.id_usuario = u.id
                WHERE gt.titulo LIKE ? OR u.nombre LIKE ?
            `;
            const terminoBusqueda = '%' + busqueda + '%';
            conx.query(sql, [terminoBusqueda, terminoBusqueda], (err, result) => {
                if (err) throw err;
                callback(result[0].total);
            });
        }
    
    static obtenerPorId(id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT gt.*, u.nombre AS autor
                FROM guias_trucos gt
                JOIN usuarios u ON gt.id_usuario = u.id
                WHERE gt.id = ?
            `;
            conx.query(sql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            });
        });
    }

    static actualizar(id, datos) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE guias_trucos SET titulo = ?, contenido = ?, miniatura = ?, video = ? WHERE id = ?";
            conx.query(sql, [datos.titulo, datos.contenido, datos.miniatura, datos.video, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static borrar(id) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM guias_trucos WHERE id = ?";
            conx.query(sql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static listar(filtro) {
        return new Promise((resolve, reject) => {
            let sql = `
                SELECT gt.*, u.nombre AS autor
                FROM guias_trucos gt
                JOIN usuarios u ON gt.id_usuario = u.id
            `;
            if (filtro === 'mas_reciente' || filtro === 'mas_antiguo') {
                sql += ` ORDER BY gt.fecha_publicacion ${filtro === 'mas_reciente' ? 'DESC' : 'ASC'}`;
            } else if (filtro === 'autor_asc' || filtro === 'autor_desc') {
                sql += ` ORDER BY u.nombre ${filtro === 'autor_asc' ? 'ASC' : 'DESC'}`;
            } else {
                sql += ` ORDER BY gt.fecha_publicacion DESC`; // Ordenar por defecto: más recientes primero
            }
            conx.query(sql, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
    
    
    
    
    

    static guardar(datos) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO guias_trucos (titulo, contenido, id_usuario, miniatura, video, fecha_publicacion) VALUES (?, ?, ?, ?, ?, NOW())";
            conx.query(sql, [datos.titulo, datos.contenido, datos.idUsuario, datos.miniatura, datos.video], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = GuiasTrucosModel;
