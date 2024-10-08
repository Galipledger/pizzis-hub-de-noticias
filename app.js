const express = require("express")
const app = express();
const port = 3000;
const session = require('express-session');
var path = require('path');
const routers = require("./routers/usuarios");
const routerpanel = require("./routers/panel")
const noticias = require("./routers/noticias")

// MiddleWare
app.use(session({
    secret: 'hola', 
    saveUnitialized: true,
    resave: true,
  }));
  // Middleware para pasar nombreusuario a las vistas
app.use((req, res, next) => {
  res.locals.nombreUsuario = req.session.nombreUsuario;
  next();
});

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/public', express.static("public"));                                                             
app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root
app.set("view engine", "ejs")
//rutas
app.use("/",routers)
app.use("/",routerpanel)
app.use("/",noticias)


app.use((req, res) => {
  res.status(404).render("error");
});
app.listen(port,()=>{
    console.log(`el servidor esta escuchando`)
})