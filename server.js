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

/* ------------------- PASSPORT ---------------------------- */
const passport = require('passport');
//const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require('./api/bCrypt');
const User = require('./baseDatos/baseDatosUsers');
const FacebookStrategy = require('passport-facebook').Strategy;
const dotenv = require('dotenv');

dotenv.config();

// completar con sus credenciales
const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;

// configuramos passport para usar facebook
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'emails'],
    scope: ['email']
}, function (accessToken, refreshToken, profile, done) {
    //console.log(profile);
    let userProfile = profile;
    return done(null, userProfile);
}));

  passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

//Inicializamos Passport 
app.use(passport.initialize());
app.use(passport.session());


/* -----------------ENDPOINTS: LOGING, SIGNUP Y LOGOUT--------------------- */
const function_passport = require('./api/function_passport');

//-LOGIN
app.get('/login', function_passport.getLogin);
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook',
    {
        successRedirect: '/datos',
        failureRedirect: '/faillogin'
    }
));
app.get('/datos', (req,res) => {
    //console.log(req.user)
    let { displayName, emails, photos} = req.user;
    console.log('datos extraidos', displayName, emails[0].value, photos[0].value)
    console.log('\n ---entre a datos----\n')
        res.render("tablas", {
            nombre: displayName,
            email: emails[0].value,
            foto: photos[0].value
        })
})
app.get('/faillogin', (req, res) => {
    res.status(401).send({ error: 'no se pudo autenticar con facebook' })
});

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

