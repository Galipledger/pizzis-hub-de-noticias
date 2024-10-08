const Usuariosmodel = require("../models/usuarios");
const usuariosmodel = new Usuariosmodel();

class usuariocontroller {
    async guardarusuario(req, res) {
        const { nombre, email, contraseña } = req.body;
    
        if (!nombre || !email || !contraseña) {
            return res.status(400).send({ error: "Todos los campos son obligatorios." });
        }
    
        // Verificar si el correo ya existe
        const usuarioExistente = await usuariosmodel.validarUsuarioPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).send({ error: "El correo ya está en uso." });
        }
    
        // Guardar usuario
        usuariosmodel.guardar(req.body, () => {
            res.send({ success: true });
        });
    }
    

    async listarusuarios(req, res) {
        usuariosmodel.listar((users) => {
            console.log(users);
            res.render("listado", { usuarios: users });
        });
    }

    async editarusuariio(req, res) {
        const id = req.params.id;
        usuariosmodel.obtenerusuario(id, async (user) => {
            if (!user) {
                user = await usuariosmodel.obtenerusuariobase();
            }
            res.render("crear", { usuario: user });
        });
    }
   mostrarvotacion(req,res){
    res.render("yavotaste")
   }

    mostrarFormulario(req, res) {
        res.render('login');
    }

    async validarFormulario(req, res) {
        const email = req.body.email;
        const contraseña = req.body.contraseña;
    
        const usuario = await usuariosmodel.validarUsuario(email, contraseña);
    
        if (usuario != null) {
            req.session.idUsuario = usuario.id;
            req.session.nombreUsuario = usuario.nombre;
            req.session.es_admin = usuario.es_admin;  // Guarda si es administrador
    
            res.json({
                "idUsuario": usuario.id,
                "error": 0
            });
        } else {
            res.json({
                "error": 1,
            });
        }
    }
    

    cerrarSesion(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.redirect('/home'); 
            }
            res.redirect('/login');
        });
    }
}

module.exports = usuariocontroller;

