const fs = require("fs");

// INICIO DEL PROGRAMA
class ContenedorApiRouter {
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

    async getById(id){
        try {
            let lectura = await fs.promises.readFile(`./src/${this.fileName}`, "utf-8")
            let prods = JSON.parse(lectura)
            let prodFind = prods.find(prod => prod.id == id)
            if(prodFind){
                console.log(prodFind)
            }else{console.log(null)}
            }
        catch(err){console.log("ERROR 1 - LECTURA DE FILE BY ID");}
    }

    async getRandom(){
        try {
            let lectura = await fs.promises.readFile(`./src/${this.fileName}`, "utf-8")
            let prods = JSON.parse(lectura)
            let prodRandom = prods.sort(()=> Math.round(Math.random())-1)
            return prodRandom[1];
            }
        catch(err){console.log("ERROR 1 - LECTURA DE FILE GET RANDOM");}
    };

    async getAll(){
        try {
            let lectura = await fs.promises.readFile(`./src/${this.fileName}`, "utf-8")
            let prods = await JSON.parse(lectura)
            return prods;
            }
        catch(err){console.log("ERROR 1 - LECTURA DE FILE GET-ALL");}
    };

    async deleteById(id){
        try {
            let lectura = await fs.promises.readFile(`./src/${this.fileName}`, "utf-8")
            let prods = JSON.parse(lectura)
            let prodFilterDeleteID = prods.filter(prod => prod.id !== id)
            console.log(prodFilterDeleteID)
            await fs.promises.writeFile(`../src/${this.fileName}`, JSON.stringify(prodFilterDeleteID))
            console.log("Guardado ELIMINANDO ID");
            }
            
        catch(err){console.log("ERROR 1 - LECTURA DE FILE");}
    };

    async deleteAll(){
        const prodListVoid = [];
        try {
            await fs.promises.writeFile(`./src/${this.fileName}`, JSON.stringify(prodListVoid))
            console.log("Guardado VACIO");
        }
        catch(err){
            console.log("ERROR 3 - AL VACIAR FILE");
        }
    }
};

module.exports = ContenedorApiRouter