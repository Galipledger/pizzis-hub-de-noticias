const express = require("express");  
const app = express();  
const http = require('http');  
const socketIo = require('socket.io');  
const session = require('express-session');  
const sharedSession = require("express-socket.io-session");  
const path = require('path');  
const fs = require('fs');  

const routerguias = require("./routers/guiasTrucos");  
const roiterresena = require("./routers/resenas");  
const routers = require("./routers/usuarios");  
const routerpanel = require("./routers/panel");  
const noticias = require("./routers/noticias");  

const server = http.createServer(app);  
const io = socketIo(server);  
const port = 3000;  

let mensajes = [];  

// Función para cargar mensajes desde el archivo JSON  
const cargarMensajes = () => {  
    try {  
        const data = fs.readFileSync('mensajes.json', 'utf8');  
        mensajes = JSON.parse(data);  
    } catch (error) {  
        console.error('No se pudo cargar el archivo de mensajes:', error);  
    }  
};  

// Función para guardar mensajes en el archivo JSON  
const guardarMensajes = () => {  
    try {  
        fs.writeFileSync('mensajes.json', JSON.stringify(mensajes, null, 2));  
    } catch (error) {  
        console.error('No se pudo guardar el archivo de mensajes:', error);  
    }  
};  

// Cargar los mensajes al iniciar la aplicación  
cargarMensajes();  

// Middleware de sesiones  
const sessionMiddleware = session({  
    secret: 'hola',  
    saveUninitialized: true,  
    resave: true,  
    cookie: {  
        maxAge: 30 * 60 * 1000 // 30 minutos  
    }  
});  

app.use(sessionMiddleware);  

// Configuración de Socket.IO para compartir sesiones con Express  
io.use(sharedSession(sessionMiddleware, {  
    autoSave: true  
}));  

// Middleware para pasar nombreUsuario a las vistas  
app.use((req, res, next) => {  
    res.locals.nombreUsuario = req.session.nombreUsuario;  
    next();  
});  

// Configuración de body-parser  
app.use(express.urlencoded({ extended: false }));  
app.use(express.json());  

// Archivos estáticos  
app.use('/public', express.static("public"));  
app.use(express.static(path.join(__dirname, 'public')));  

// Configuración de EJS como motor de vistas  
app.set("view engine", "ejs");  

// Rutas  
app.use("/", routers);  
app.use("/", routerpanel);  
app.use("/", noticias);  
app.use("/", roiterresena);  
app.use("/", routerguias);  

// Rutas para manejar errores 404  
app.use((req, res) => {  
    res.status(404).render("error");  
});  

// Configuración de Socket.IO para el chat en tiempo real  
io.on('connection', (socket) => {  
    const usuarioConectado = socket.handshake.session?.nombreUsuario || 'Un usuario';  

    // Emitir mensaje de conexión solo al conectarse  
    socket.emit('user status', { user: usuarioConectado, message: 'se ha conectado al chat.' });  
    console.log(`${usuarioConectado} se ha conectado al chat.`);  
    
    // Enviar el historial de mensajes al nuevo usuario  
    socket.emit('load messages', mensajes);  

    // Recibir mensajes del cliente y retransmitir a todos los usuarios conectados  
    socket.on('chat message', (data) => {  
        mensajes.push(data); // Agregar mensaje al historial  
        guardarMensajes(); // Guardar mensajes en el archivo  
        io.emit('chat message', data); // Reenvía el mensaje con el nombre de usuario  
    });  

    // Manejar desconexión de usuario  
    socket.on('disconnect', () => {  
        console.log(`${usuarioConectado} se ha desconectado.`);  
        // Emitir la desconexión solo en el evento de desconexión  
        io.emit('user status', { user: usuarioConectado, message: 'se ha desconectado del chat.' });  
    });  
});

// Iniciar el servidor  
server.listen(port, () => {  
    console.log(`Servidor corriendo en http://localhost:${port}`);  
});