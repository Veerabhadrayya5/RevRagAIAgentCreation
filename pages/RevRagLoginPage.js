
class RevRagLoginPage {
    constructor(page) {
      this.page = page;
  
      // Locators for the login form
      this.emailInput = page.getByPlaceholder('you@company.com');
      this.passwordInput = page.getByPlaceholder('Enter your password');
      this.signInButton = page.getByRole('button', {
        name: 'Sign in',
        exact: true
      });
    }
  
    // Open the RevRag login page
    async open() {
      await this.page.goto('https://app.revrag.ai/login', {
        waitUntil: 'domcontentloaded'
      });
    }
  
    // Enter credentials and submit the login form
    async login(email, password) {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.signInButton.click();
    }
  }
  
  module.exports = { RevRagLoginPage };
  