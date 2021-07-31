const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const productos = require('./api/productos');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const cookieParser = require('cookie-parser');
const session = require('express-session');

const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://pfsantillan:35783028@cluster0.kfxor.mongodb.net/ecommerce?retryWrites=true&w=majority",
        mongoOptions: advancedOptions,
        ttl: 10*60
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}))

/* -------------------- Base de Datos ---------------------- */
require('./baseDatos/models/coneccion');
const baseDatosMensajes = require('./baseDatos/baseDatosMensajes');

/* -------------------- HTTP endpoints ---------------------- */
const productosRouter = require('./routes/productos');
app.use('/api', productosRouter);


const handlebars = require('express-handlebars')


//--------------------------------------------
//establecemos la configuración de handlebars
app.engine(
    "hbs",
    handlebars({
      extname: ".hbs",
      defaultLayout: 'index.hbs',
    })
);
app.set("view engine", "hbs");
app.set("views", "./views");
//--------------------------------------------

app.use(express.static('public'))

/* -------------------------------------------------------- */
/* -------------------------------------------------------- */


app.get('/login', (req,res) => {
    if(req.session.nombre) {
        res.render("tablas", {
            nombre: req.session.nombre
        })
    }
    else {
        res.sendFile(process.cwd() + '/public/login.html')
    }
})

app.post('/login', (req,res) => {
    let { nombre } = req.body
    req.session.nombre = nombre
    res.redirect('/')
})

app.get('/logout', (req,res) => {
    let nombre = req.session.nombre
    if(nombre) {
        req.session.destroy( err => {
            if(!err) res.render("logout", { nombre })
            else res.redirect('/')
        })
    }
    else {
        res.redirect('/')
    }
})
/* -------------------------------------------------------- */


/* -------------------- Web Sockets ---------------------- */
const mensajes = [];
io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');
    
    socket.emit('productos', productos.listar());
    socket.on('update', async data => {
     await io.sockets.emit('productos', productos.listar());
    });

    socket.emit('messages', await baseDatosMensajes.leer());
    socket.on('new-message', async msj=>{
        //console.log(msj)
        await baseDatosMensajes.guardar(msj)
        io.sockets.emit('messages', await baseDatosMensajes.leer()); 
    })    
});
/* ------------------------------------------------------- */
/* ------------------------------------------------------- */
const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
http.on("error", error => console.log(`Error en servidor ${error}`))

