const fs = require("fs");

module.exports = class Chat {
  constructor(fileName) {
    this.fileName = fileName;
  }

  getAll() {
    const response = fs.readFileSync(`./src/${this.fileName}`, "utf-8");
    if(response === "") {
      return [];
    } else {
      return JSON.parse(response);
    }
  }

  save(message) {
    const data = this.getAll();
    data.push(message);
    fs.writeFileSync(`./src/${this.fileName}`, JSON.stringify(data));
  }
}