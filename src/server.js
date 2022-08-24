const express = require ('express')
// const { Server: HttpServer } = require("http");
// const { Server: IOServer } = require("socket.io");
const { Router } = require('express');
const fs = require("fs");

const app = express();
// const httpServer = new HttpServer(app);
// const io = new IOServer(httpServer);

// app.set("views", "./views")
// app.set("view engine", "ejs")

let today = new Date()

const validarAdmin = (req, res, next) => {
    if (req.headers.admin == "True" || req.headers.admin == "true"){
        next()
    } else {
        return res.status(401).json({error: -1, descripcion: "Acceso a ruta no autorizado"})
    }
}

app.use(express.static('public'))

const ContenedorApiRouter = require('../api/contenedorApi.js')
const archivoApiRouter = new ContenedorApiRouter("productos.txt")
// const ContenedorMsjs = require('../api/contenedorMsjs.js')
// const msjs = new ContenedorMsjs("msjs.txt")

const routerProductos = Router()

app.use('/api/productos', routerProductos)
routerProductos.use(express.json())
routerProductos.use(express.urlencoded({extended: true}))

// <------------------------- Sockets ------------------------->
// io.on("connection", async socket => {

//     console.log("Un cliente se ha conectado");
//     socket.emit("products", await archivoApiRouter.getAll())
  
//     socket.on("update", async producto => {
//         archivoApiRouter.save(producto);
//         io.sockets.emit("products", await archivoApiRouter.getAll());
//     })

//     // carga inicial de mensajes
//     socket.emit('messages', await msjs.getAll());

//     // actualizacion de mensajes
//     socket.on("new-message", async data => {
//         await msjs.save(data)
//         io.sockets.emit("messages", await msjs.getAll());
//         })
//   });

// RUTAS DE PRODUCTOS


routerProductos.get('/', async (req, res) => {
    const id = Number(req.params.id)

    let lectura = await fs.promises.readFile("./src/productos.txt", "utf-8")
    let prods = JSON.parse(lectura)

	res.json(prods);
    
    // const filtered = prods.find(prod => prod.id == id)
    // if (filtered){
    //     res.render("pages/index",{filtered})
    // } else {
    // res.render("pages/index",{prods})
    
    // CORREGIR RENDERIZADO TERNARIO POR ID
})

routerProductos.post('/', async (req, res) => {
    let lectura = await fs.promises.readFile("./src/productos.txt", "utf-8")
    let prods = JSON.parse(lectura)
    // req.body.id = Math.round(Math.random() * 9999)
    req.body.id = prods.length + 1
    req.body.timestamp = today
    archivoApiRouter.save(req.body)
    res.json(req.body)
})

routerProductos.put('/:id', validarAdmin, async (req, res) => {
    const id = Number(req.params.id)

    let lectura = await fs.promises.readFile("./src/productos.txt", "utf-8")
    let prods = JSON.parse(lectura)

    const searchingId = prods.findIndex(prod => prod.id == id)
        if (searchingId !== -1) {
            archivoApiRouter.update(req.body, id)
            return res.json({accedido: `Producto con ID: ${id} actualizado`})
        } else {
            return res.json({ Error: 'Producto no encontrado' })
        }
})

routerProductos.delete('/:id', validarAdmin, async (req, res) => {
    const id = Number(req.params.id)

    let lectura = await fs.promises.readFile("./src/productos.txt", "utf-8")
    let prods = JSON.parse(lectura)

    const searchingId = prods.findIndex(prod => prod.id == id)
        if (searchingId !== -1) {
            archivoApiRouter.deleteById(id)
            let respuesta = res.json({accedido: `Producto con ID: ${id} eliminado`})
            return respuesta
        } else {
            return res.json({ error: 'producto no encontrado' })
        }
})

// RUTAS DE CARRITO

// routerCarrito.get('/:id/productos', async (req, res) => {
//     const id = Number(req.params.id)

//     let lectura = await fs.promises.readFile("./src/carritos.txt", "utf-8")
//     let carts = JSON.parse(lectura)

//     const searchingId = carts.findIndex(cart => cart.id == id)
//     if (searchingId !== -1) {
//         const filtered = carts.filter(cart => cart.id == id)
//         const onlyProds = filtered.map(prod => prod.productos)
//         return res.json(onlyProds)
//     } else {
//         return res.json({ Error: 'Carrito no encontrado' })
//     }

// })

// routerCarrito.post('/', async (req, res) => {
//     let lectura = await fs.promises.readFile("./src/carritos.txt", "utf-8")
//     let carts = JSON.parse(lectura)
//     req.body.id = carts.length + 1
//     req.body.timestamp = today
//     cart.save(req.body)
//     res.json(req.body)
// })

// routerCarrito.post('/:id/productos', async (req, res) => {
//     let lectura = await fs.promises.readFile("./src/carritos.txt", "utf-8")
//     let carts = JSON.parse(lectura)
//     let lectura2 = await fs.promises.readFile("./src/productos.txt", "utf-8")
//     let prods = JSON.parse(lectura2)
//     const id = Number(req.params.id)

//     const searchingCart = carts.findIndex(cart => cart.id == id)
//     const searchingProd = prods.findIndex(prod => prod.id == req.body.id)

//     if (searchingCart !== -1){
//         if (searchingProd !== -1) {
//             let addProd = prods.find(prod => prod.id == req.body.id)
//             cart.update(addProd, id)
//             return res.json({accedido: `Producto con ID: ${req.body.id} agregado al carrito ${id}`})
//         } else {
//             return res.json({ Error: 'Producto no encontrado' })}
//     } else {return res.json({ Error: 'Carrito no encontrado' })}
// })

// routerCarrito.delete('/:id', async (req, res) => {
//     const id = Number(req.params.id)

//     let lectura = await fs.promises.readFile("./src/carritos.txt", "utf-8")
//     let carts = JSON.parse(lectura)

//     const searchingId = carts.findIndex(cart => cart.id == id)
//         if (searchingId !== -1) {
//             cart.deleteById(id)
//             return res.json({accedido: `Carrito con ID: ${id} eliminado`})
//         } else {
//             return res.json({ error: 'Carrito no encontrado' })
//         }

// })

// routerCarrito.delete('/:id/productos/:id_prod', async (req, res) => {
//     const cartId = Number(req.params.id)
//     const prodId = Number(req.params.id_prod)

//     let lectura2 = await fs.promises.readFile("./src/carritos.txt", "utf-8")
//     let carts = JSON.parse(lectura2)

//     const searchingCartId = carts.findIndex(cart => cart.id == cartId)
    
//         if (searchingCartId !== -1) {
//             cart.subtract(cartId, prodId)
//             return res.json({accedido: `Producto con ID: ${prodId} eliminado del carrito con ID: ${cartId}`})
//         } else {
//             return res.json({ error: 'Carrito no encontrado' })
//         }

// })

// ----------- SERVER

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`Servidor HTTP escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));