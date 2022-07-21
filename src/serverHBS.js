const express = require('express')
const app = express()
const { Router } = require('express')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const fs = require("fs");

app.use(express.static('public'))

let messages = [
];

// const Contenedor = require("./src/contenedor");
// const archivoApiRouter = new Contenedor("productos.json");

const ContenedorApiRouter = require('../api/contenedorApi.js')
const archivoApiRouter = new ContenedorApiRouter("productosHBS.txt");

const Chat = require("../src/chat.js");
const chating = new Chat("chatGrupal.txt");

io.on("connection", socket => {
  const response = archivoApiRouter.getAll();
  console.log("Un cliente se ha conectado");
  socket.emit("chatGrupal", chating.getAll());
  socket.emit("products", response)

  socket.on("new-chatGrupal", data => {
    chating.save(data)
    io.sockets.emit("chatGrupal", chating.getAll());
    io.sockets.emit("products", response);
  });
});

const exphbs = require("express-handlebars")
app.engine(".hbs", exphbs.engine({
    defaultLayout: "index",
    extname: ".hbs"
}));

app.set("view engine", ".hbs")
app.set("views", "./views")

const routerProductos = Router()
app.use('/api/productos', routerProductos)
routerProductos.use(express.json())
routerProductos.use(express.urlencoded({extended: true}))

// DEVUELVE TODOS LOS PRODUCTOS
routerProductos.get('/listar', async (req, res) => {
    let lectura = await fs.promises.readFile("./src/productosHBS.txt", "utf-8")
    let prods = JSON.parse(lectura)
    res.render("listar", { prods } );
})

routerProductos.get('/listar/:id', async (req, res) => {
    const id = Number(req.params.id);

    let lectura = await fs.promises.readFile("./src/productosHBS.txt", "utf-8")
    let prods = JSON.parse(lectura)
    // if(id < 1 || id > prods.length){
    //     return res.send({error: "Producto no encontrado"})
    // }
    const filtered = prods.filter(prod => prod.id == id)
    res.render("listarById", { filtered } );
    // res.json(filtered)
})

routerProductos.post('/guardar', async (req, res) => {
    let lectura = await fs.promises.readFile("./src/productosHBS.txt", "utf-8")
    let prods = JSON.parse(lectura)
    // req.body.id = Math.round(Math.random() * 9999);
    req.body.id = prods.length + 1;
    archivoApiRouter.save(req.body)
    res.redirect('/')
})

routerProductos.put('/actualizar/:id', (req, res) => {
    const id = Number(req.params.id);
    if(id < 1 || id != (productos.id = id)){
        return res.send({error: "Producto no encontrado"})
    }
    req.body.id = id
    productos.splice(id - 1, 1, req.body)
    productos.sort((a,b)=>a.id-b.id)

    res.json(req.body)
})

routerProductos.delete('/eliminar/:id', async (req, res) => {
    const id = Number(req.params.id);

    let lectura = await fs.promises.readFile("./src/productosHBS.txt", "utf-8")
    let prods = JSON.parse(lectura)

    const filtered = prods.filter(prod => prod.id == id)
    console.log(filtered);
    if(id < 1 || id != filtered.id){
        return res.send({error: "Producto no encontrado"})
    }
    req.body.id = id
    // productos.splice(id - 1, 1)
    // productos.sort((a,b)=>a.id-b.id)
    archivoApiRouter.deleteById(id)
    // DEVUELVE AL BODY DEL POST PARA CONFIRMAR LA ACCION
    res.json(req.body)
})

// ----------- SERVER
const PORT = process.env.PORT || 8081;
const srv = server.listen(PORT, () => { 
    console.log(`Servidor Http con Websockets escuchando en el puerto ${srv.address().port}`);
})
srv.on('error', error => console.log(`Error en servidor ${error}`))

