const LoginLocators = require('../locators/login.locators');

class LoginActions {
    constructor(bingoPage) {
        this.bingoPage = bingoPage;
        this.locators = new LoginLocators(bingoPage.page);
    }

    async login(username, password) {
        await this.bingoPage.fill(this.locators.usernameInput, username);
        await this.bingoPage.fill(this.locators.passwordInput, password);
        await this.bingoPage.click(this.locators.loginButton);
    }

    async getErrorMessage() {
        return await this.bingoPage.getText(this.locators.errorMessage);
    }
}

module.exports = LoginActions; 