const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const productos = require('./api/productos');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'))

/* -------------------- Base de Datos ---------------------- */
require('./baseDatos/models/coneccion');
const baseDatosMensajes = require('./baseDatos/baseDatosMensajes');

/* -------------------- HTTP endpoints ---------------------- */
const productosRouter = require('./routes/productos');
app.use('/api', productosRouter);

/* ------------------- PASSPORT ---------------------------- */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require('./api/bCrypt');
const User = require('./baseDatos/baseDatosUsers');

passport.use('login', new LocalStrategy({
  passReqToCallback: true
},
  async function (req, username, password, done) {
    // Verificacion si en la BD existe el usuario
    let u = await User.listar();
    let usuario = u.find(u => u.username === username);
    if (!usuario) {
        return done(null, false, console.log('mensaje', 'usuario no encontrado'));
    } else {
        if (!bCrypt.isValidPassword(usuario, password)) {
            console.log('contraseña invalida');
            return done(null, false, console.log('mensaje', 'contraseña invalida'));
        } else {
            return done(null, usuario);
        }
    }
})
);


passport.use('signup', new LocalStrategy({
    passReqToCallback: true
}, async function (req, username, password, done) {
    // Verificacion si en la BD existe el usuario
    let u = await User.listar();
    let usuario = u.find(u => u.username === username);
    if (usuario) {
        console.log('usuario ya existe');
        return done(null, false, console.log('mensaje', 'usuario ya existe'));
    } else {
        let newU = {
            username: username,
            password: bCrypt.createHash(password),
        };
        let newUser = await User.guardar(newU);

        return done(null, newUser,console.log('Resgitro de Usuarios Exitoso!!!'));
    }
})
);

passport.serializeUser(function (user, done) {
    done(null, user._id);
  });
  
  passport.deserializeUser(async function (id, done) {
    done(null, await User.buscarPorId(id));
  });

/* --------------- Configuración de handlebars -------------- */
const handlebars = require('express-handlebars');
app.engine(
    "hbs",
    handlebars({
      extname: ".hbs",
      defaultLayout: 'index.hbs',
    })
);
app.set("view engine", "hbs");
app.set("views", "./views");

/* -----------------Cookies, Session y Storages--------------------- */
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/ecommerce',//"mongodb+srv://pfsantillan:35783028@cluster0.kfxor.mongodb.net/ecommerce?retryWrites=true&w=majority",
        mongoOptions: advancedOptions,
        ttl: 10*60
    }),
   /* cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 10*10*60
    },*/
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}));

//Inicializamos Passport 
app.use(passport.initialize());
app.use(passport.session());

/* -----------------ENDPOINTS: LOGING, SIGNUP Y LOGOUT--------------------- */
const function_passport = require('./api/function_passport');

//-LOGIN
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), function_passport.postLogin);
app.get('/login', function_passport.getLogin);
app.get('/faillogin', function_passport.getFaillogin);

//-SIGNUP
app.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup' }), function_passport.postSignup);
app.get('/signup', function_passport.getSignup);
app.get('/signup-exitoso', function_passport.getSignupSucessfull);
app.get('/failsignup', function_passport.getFailsignup);

//  LOGOUT
app.get('/logout', function_passport.getLogout);

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

