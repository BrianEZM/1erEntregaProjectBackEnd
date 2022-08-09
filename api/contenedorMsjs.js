const fs = require("fs");

module.exports = class ContenedorMsjs {
  constructor(fileName) {
    this.fileName = fileName;
  }

  async getAll() {
    try {    
      const response = await fs.promises.readFile(`./src/${this.fileName}`, "utf-8");
        if(response === "") {
        return [];
        } else {
        return JSON.parse(response);
        }
    }
    catch(error){
      console.log({error: error});
  }}

  async save(message) {
    try {
      let lectura = await fs.promises.readFile(`./src/${this.fileName}`, "utf-8")
      let existents = JSON.parse(lectura)
      let listObj = [...existents, message]
      await fs.promises.writeFile(`./src/${this.fileName}`, JSON.stringify(listObj))
    }
    catch (error) {
      console.log({error: error});
    }
  }
}