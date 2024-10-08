const conx = require("../database/db");

class Usuariosmodel {
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

    async listar(callback) {
        let sql = "SELECT * FROM usuarios";
        conx.query(sql, [], (err, results) => {
            if (err) throw err;
            callback(results);
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
