const { setWorldConstructor } = require('@cucumber/cucumber');
const { BingoPage } = require('playwright-bingo');

class CustomWorld {
  constructor() {
    this.page = null;
    this.bingoPage = null;
  }
}

setWorldConstructor(CustomWorld); 