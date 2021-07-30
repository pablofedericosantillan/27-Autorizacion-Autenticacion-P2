const mensajes = require('./models/mensajes');

const {normalize, schema } = require('normalizr');
const schemaAuthor = new schema.Entity('author',{},{idAttribute: 'email'});
const schemaMensaje = new schema.Entity('post', {
    author: schemaAuthor
},{idAttribute: '_id'})
const schemaMensajes = new schema.Entity('posts', {
    msj: [schemaMensaje]
},{idAttribute: 'id'})

class BaseDatosMensajes {
    constructor() {
        (async() => {
            await mensajes.deleteMany({});
        })()
    }
    async leer(){
        try{
            let result = await mensajes.find()
            let mensajesConId = { 
                id: 'mensajes', 
                msj : result.map( mensaje => ({...mensaje._doc}))
            }
            let mensajesConIdN = normalize(mensajesConId, schemaMensajes)
            return mensajesConIdN;
        }catch(err){
               console.log('Error en guardar MSJ mongo',err); 
           }
       }

    async guardar(mjs){
        try{
            await mensajes.create(mjs);
            return false;

         }catch(err){
            console.log('Error en guardar MSJ mongo',err); 
        }
    }

}

module.exports = new BaseDatosMensajes();