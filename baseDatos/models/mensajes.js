const mongoose = require('mongoose');

const schema = mongoose.Schema({
    author:{
    email: { type: String, required: true, max: 100 },
    name: { type: String, required: true, max: 100 },
    apellido: { type: String, required: true, max: 100 },
    edad: { type: String, required: true, max: 100 },
    alias: { type: String, required: true, max: 100 },
    avatar: { type: String, required: true, max: 100 }

    },
    fyh: { type: String, required: true },
    text: { type: String, required: true, max: 100 }
});


const Mensajes = mongoose.model('mensajes', schema);

module.exports = Mensajes;
