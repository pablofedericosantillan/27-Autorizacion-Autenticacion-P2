const schema= normalizr.schema;
const denormalize= normalizr.denormalize;

const schemaAuthor = new schema.Entity('author',{},{idAttribute: 'email'});

// Definimos un esquema de mensaje
const schemaMensaje = new schema.Entity('post', {
    author: schemaAuthor
},{idAttribute: '_id'})

// Definimos un esquema de posts
const schemaMensajes = new schema.Entity('posts', {
  msj: [schemaMensaje]
},{idAttribute: 'id'})

/* ----------------------------------------------------------------- */
socket.on('messages', function(data) { 
  console.log(data)
  try {
  

  if(data){


  let denormalizedData = denormalize(data.result, schemaMensajes,data.entities)

  let mensajesNsize = JSON.stringify(data).length;
  let mensajesDsize = JSON.stringify(denormalizedData).length


  let porcentajeC = parseInt((mensajesNsize * 100) / mensajesDsize)
  console.log(`Porcentaje de compresión ${porcentajeC}%`)
  document.getElementById('compresion-info').innerText = porcentajeC;
console.log(denormalizedData)
  render(denormalizedData.msj);

}else{
  console.log(data)
    render([]);
}

} catch (error) {
  console.log(error)
}
});

function render(data){
  try {

  //console.log('render',data)
  let html=data.map(function(elem) {
  return (`
  <div class="form-group">
  <strong style="color:blue;">${elem.author.email} </strong>
  <em style="color:brown;">${elem.fyh} </em>
  <em style="color:green;">${elem.text} </em>
   <img width="50" src=${elem.author.avatar}></img>
  </div>
  `)
  }).join(" "); 

  document.getElementById('mensajes').innerHTML=html;
  document.getElementById('centro-mensajes').reset();
  document.getElementById('centro-mensajes1').reset();
      
} catch (error) {
  console.log(error)
}
}


function addMessage(e) { 
  e.preventDefault()

  try {
  
  let msj={
    author:{
        email: document.getElementById('email').value,
        name: document.getElementById('name').value,
        apellido: document.getElementById('apellido').value,
        edad: document.getElementById('edad').value,
        alias: document.getElementById('alias').value,
        avatar: document.getElementById('avatar').value

        },
    fyh: new Date().toLocaleString(),
    text: document.getElementById('text').value
};


  socket.emit('new-message', msj); 
  return false;
} catch (error) {
  console.log(error)

}
}
