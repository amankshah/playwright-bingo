const { setWorldConstructor } = require('@cucumber/cucumber');

class CustomWorld {
  constructor() {
    this.page = null;
    this.bingoPage = null;
  }
}

setWorldConstructor(CustomWorld);