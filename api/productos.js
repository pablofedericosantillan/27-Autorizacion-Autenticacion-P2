const moment = require('moment');
const baseDatosProductos = require('../baseDatos/baseDatosProductos');


class Productos {
    constructor() {
        this.item = [];
    }

    async listar() {
            try{
                return await baseDatosProductos.listar();
            }catch(err){
                console.log('Error en la funcion listar', err); 
            }
    }

    async buscarPorId(id){
        try{
            return await baseDatosProductos.buscarPorId(id) || { error: `producto con id ${id} no encontrado`};
        }catch(err){
            console.log('Error en la funcion buscarPorId', err); 
        }
    }

     async guardar(newProduct){
            try{
                console.log(newProduct)
            newProduct.timestamp= `${moment().format("DD/MM/YYYY HH:mm:ss")}`;

            console.log(`entro en guardar ${moment().format("DD/MM/YYYY HH:mm:ss")}`)

                return await baseDatosProductos.guardar(newProduct);
            }catch(err){
                console.log('Error en la funcion agregar', err); 
            }

    }

   async actualizar(id,newProduct){
            try{
                let p = await baseDatosProductos.listar();
                let index = p.findIndex(x => x.id == id);
                if(index != -1){
                newProduct.timestamp= `${moment().format("DD/MM/YYYY HH:mm:ss")}`;
                return await baseDatosProductos.actualizar(id,newProduct);
            }else{
                return {error: "producto no encontrado para Actualizar" }
                }
            }catch(err){
                console.log('Error en la funcion actualizar', err); 
            }
    }
    
    async borrar(id){         
            try{
                let p = await baseDatosProductos.listar();
                let index = p.findIndex(x => x.id == id);
                if(index != -1){
                    await baseDatosProductos.borrar(id)
                    return 'Proceso de borrado exitoso!';
                }else{
                return {error: "producto no encontrado para Borrar" }
                }
            }catch(err){
                console.log('Error en la funcion borrar', err); 
            }                   
    }
}

module.exports = new Productos();