const TodonewHomeLocators = require('../locators/todonewHome.locators');

class TodonewHomeActions {
    constructor(page) {
        this.page = page;
        this.locators = new TodonewHomeLocators(page);
    }
    // Add your page actions here
}

module.exports = TodonewHomeActions;
