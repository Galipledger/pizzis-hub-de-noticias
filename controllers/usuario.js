const Usuariosmodel = require("../models/usuarios");                                  
const usuariosmodel = new Usuariosmodel();

class usuariocontroller {
    async guardarusuario(req, res) {
        const datos = req.body;
        usuariosmodel.guardar(datos, () => {
            res.send({ "success": true });
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

    mostrarFormulario (req, res) {
		res.render('login');
	}

	async validarFormulario (req, res) {

		// Para recibir datos yo puedo utilizar:
		// req.query -> recibo los datos por url (normalmente GET)
		// req.params -> recibo los datos por comodin 
		// req.body -> recibo los datos por body (normalmente POST Y PUT)
		const email = req.body.email;
		const contraseña = req.body.contraseña;

		const usuario = await usuariosmodel.validarUsuario(email, contraseña);
		
		if (usuario != null) {
			req.session.idUsuario = usuario.id;
		
			console.log(req.session);
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
}

module.exports = usuariocontroller;
