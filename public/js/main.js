let socket = io.connect(); 

socket.on('productos', function(productos) { 
    //console.log(productos);
    document.getElementById('datos').innerHTML = data2TableHBS(productos)
});

const form = document.querySelector('form')
form.addEventListener('submit', e => {
    e.preventDefault()

    const data = { 
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        codigo: document.getElementById('codigo').value,
        thumbnail: document.getElementById('thumbnail').value,
        precio: document.getElementById('precio').value,
        stock: document.getElementById('stock').value 
    };
   //console.log('antes del fetch',data)


    fetch('/api/productos/guardar', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(respuesta => respuesta.json())
    .then(productos => {
        form.reset();
        socket.emit('update', 'enviar tabla a todos');
    })
    .catch(error => {
        console.log('ERROR', error);
    });
});

function data2TableHBS(productos) {
    const plantilla = `
        <style>
            .table td,
            .table th {
                vertical-align: middle;
            }
        </style>

        {{#if productos.length}}
        <div class="table-responsive">
            <table class="table table-dark">
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Foto</th>
                </tr>
                {{#each productos}}
                <tr>
                    <td>{{this.nombre}}</td>
                    <td>$ {{ this.precio }}</td>
                    <td><img width="50" src={{this.thumbnail}} alt="not found"></td>
                </tr>
                {{/each}}
            </table>
        </div>
        {{/if}}
    `
    var template = Handlebars.compile(plantilla);
    let html = template({ productos: productos, hayProductos: productos.length });
    return html;
}
