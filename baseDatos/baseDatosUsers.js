const user = require('./models/user_passport');

class Users {
    constructor() {
        /*(async() => {
            await user.deleteMany({});
        })()*/
    }
    async listar(){
        try{
        return await user.find();
        }catch(err){
            console.log('Error en listar mongo',err); 
        }
    }

    async buscarPorId(id){
        try{
            return await user.findOne({_id:id});
        }catch(err){
            console.log('Error en buscarPorId mongo',err); 
        }
    }

    async guardar(u){

        try{
            let p={
                username: u.username,
                password: u.password
            }

            let uSave= new user(p);
            await uSave.save();
            return uSave;

         }catch(err){
            console.log('Error en guardar mongo',err); 
        }
    }


    /*async borrar(id){         
        try{
            let result = await productos.deleteOne({ _id: id });
            return false;
        }catch(err){
            console.log('Error en borrar mongo',err); 
        }             
    }*/
}

module.exports = new Users();