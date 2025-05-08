const { setWorldConstructor } = require('@cucumber/cucumber');
const { BingoPage } = require('../../lib/index');

class CustomWorld {
  constructor() {
    this.page = null;
    this.bingoPage = null;
  }
}

setWorldConstructor(CustomWorld); 