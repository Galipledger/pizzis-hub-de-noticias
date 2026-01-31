const conx = require("../database/db");

class Usuariosmodel {
       // Método para banear usuario
       async banearUsuario(id, duracion, motivo) {
        const fechaFinBaneo = new Date(Date.now() + duracion * 86400000); // Duración en días a milisegundos
        const sql = "UPDATE usuarios SET baneado = 1, motivo_baneo = ?, fecha_fin_baneo = ? WHERE id = ?";
        return new Promise((resolve, reject) => {
            conx.query(sql, [motivo, fechaFinBaneo, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    // Método para desbanear usuario
    async desbanearUsuario(id) {
        const sql = "UPDATE usuarios SET baneado = 0, motivo_baneo = NULL, fecha_fin_baneo = NULL WHERE id = ?";
        return new Promise((resolve, reject) => {
            conx.query(sql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    // Método para verificar si el usuario está baneado
    async verificarBaneo(email) {
        const sql = "SELECT baneado, motivo_baneo, fecha_fin_baneo FROM usuarios WHERE email = ?";
        return new Promise((resolve, reject) => {
            conx.query(sql, [email], (err, result) => {
                if (err) return reject(err);
                resolve(result[0] || null);
            });
        });
    }
    async validarUsuarioPorEmail(email) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM usuarios WHERE email = ?";
            conx.query(sql, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results.length > 0); // Devuelve true si hay un usuario con ese correo
            });
        });
    }
    
    validarUsuario(email, contraseña) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM usuarios WHERE email = ? AND contraseña = ?`;
            conx.query(sql, [email, contraseña], (err, results) => {
                try {
                    if (results.length === 0) {
                        resolve(null);
                    }
                    resolve(results[0]);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async obtenerusuariobase() {
        return {
            id: 0,
            nombre: "",
            email: "",
            contraseña: ""
        };
    }
    listar(busqueda, callback) {
        let sql = "SELECT * FROM usuarios";
        const params = [];
        if (busqueda) {
            sql += " WHERE nombre LIKE ? OR email LIKE ?";
            const terminoBusqueda = '%' + busqueda + '%';
            params.push(terminoBusqueda, terminoBusqueda);
        }
        conx.query(sql, params, (err, results) => {
            if (err) throw err;
            if (typeof callback === 'function') {
                callback(results);
            } else {
                throw new Error('Callback is not a function');
            }
        });
    }
    

    

    async obtenerusuario(id, callback) {
        let sql = "SELECT * FROM usuarios WHERE id = ?";
        conx.query(sql, [id], (err, results) => {
            if (err) throw err;
            if (results.length === 0) callback(false);
            else callback(results[0]);
        });
    }

    async guardar(datos, callback) {
        if (datos.id === 0) {
            let sql = "INSERT INTO usuarios(nombre, email, contraseña) VALUES(?, ?, ?)";
            conx.query(sql, [datos.nombre, datos.email, datos.contraseña], (err, results) => {
                if (err) throw err;
                callback(results);
            });
        } else {
            let sql = "UPDATE usuarios SET nombre = ?, email = ?, contraseña = ? WHERE id = ?";
            conx.query(sql, [datos.nombre, datos.email, datos.contraseña, datos.id], (err, results) => {
                if (err) throw err;
                callback(results);
            });
        }
    }
}

module.exports = Usuariosmodel;
