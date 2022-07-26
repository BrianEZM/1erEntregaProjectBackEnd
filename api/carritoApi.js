const fs = require("fs");

// INICIO DEL PROGRAMA
class CarritoApi {
    constructor(fileName){
        this.fileName = fileName;
    }

    async save(object){
        try {   
                let lectura = await fs.promises.readFile(`./src/${this.fileName}`, "utf-8")
                let existents = JSON.parse(lectura)
                let listObj = [...existents, object]
                await fs.promises.writeFile(`./src/${this.fileName}`, JSON.stringify(listObj))

        }
        catch(err){
            console.log("ERROR 2 - CREACION DE FILE (save)");
        }
    }

    async update(object, id) {
        try {   
            let lectura = await fs.promises.readFile(`./src/${this.fileName}`, "utf-8")
            let existents = JSON.parse(lectura)
            let cartFind = existents.find(cart => cart.id == id)
            const index = existents.findIndex(p => p.id == id)
            if (index !== -1) {
                cartFind.productos.push(object)
                existents[index].productos = cartFind.productos
                await fs.promises.writeFile(`./src/${this.fileName}`, JSON.stringify(existents))
            return existents
            } else {
            return { error: 'Cart no encontrado' }
            }
        }
        catch(err){
            console.log("ERROR 2 - CREACION DE FILE (add prod to cart)");
        }
    }

    async subtract(cartId, prodId) {
        try {   
            let lectura = await fs.promises.readFile(`./src/${this.fileName}`, "utf-8")
            let existents = JSON.parse(lectura)
            let cartFind = existents.find(cart => cart.id == cartId)
            const index = existents.findIndex(p => p.id == cartId)
            if (index !== -1) {
                const subtracted = cartFind.productos.filter(prod => prod.id != prodId)
                existents[index].productos = subtracted
                await fs.promises.writeFile(`./src/${this.fileName}`, JSON.stringify(existents))
                return existents
            } else {
                return { error: 'Cart no encontrado' }
            }
        }
        catch(err){
            console.log("ERROR 2 - CREACION DE FILE (delete prod of cart)");
        }
    }

    // async getById(id){
    //     try {
    //         let lectura = await fs.promises.readFile(`./src/${this.fileName}`, "utf-8")
    //         let carts = JSON.parse(lectura)
    //         let cartFind = carts.find(cart => cart.id == id)
    //         if(cartFind){
    //             console.log(cartFind)
    //         }else{console.log(null)}
    //         }
    //     catch(err){console.log("ERROR 1 - LECTURA DE FILE BY ID");}
    // }

    async getAll(){
        try {
            let lectura = await fs.promises.readFile(`./src/${this.fileName}`, "utf-8")
            let carts = await JSON.parse(lectura)
            return carts;
            }
        catch(err){console.log("ERROR 1 - LECTURA DE FILE GET-ALL");}
    };

    async deleteById(id){
        try {
            let lectura = await fs.promises.readFile(`./src/${this.fileName}`, "utf-8")
            let carts = JSON.parse(lectura)
            let cartFilterDeleteID = carts.filter(cart => cart.id !== id)
            await fs.promises.writeFile(`./src/${this.fileName}`, JSON.stringify(cartFilterDeleteID))
            console.log("Guardado ELIMINANDO ID (cart)");
            }
            
        catch(err){console.log("ERROR 1 - LECTURA DE FILE");}
    };

    async deleteAll(){
        const cartListVoid = [];
        try {
            await fs.promises.writeFile(`./src/${this.fileName}`, JSON.stringify(cartListVoid))
            console.log("Guardado VACIO");
        }
        catch(err){
            console.log("ERROR 3 - AL VACIAR FILE");
        }
    }
};

module.exports = CarritoApi