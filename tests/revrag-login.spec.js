
require('dotenv').config();

const { test, expect } = require('../fixtures/test');
const { RevRagLoginPage } = require('../pages/RevRagLoginPage');

test.describe('RevRag Login Tests', () => {

  // TC_LOGIN_001: Verify the login page and its controls
  test('TC_LOGIN_001 - Verify login page loads', async ({ page }) => {
    const loginPage = new RevRagLoginPage(page);

    await loginPage.open();

    await expect(page).toHaveURL(/app\.revrag\.ai\/login/);
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
  });

  // TC_LOGIN_002: Log in using valid credentials
  test('TC_LOGIN_002 - Verify successful login', async ({ page }) => {
    const email = process.env.REVRAG_EMAIL;
    const password = process.env.REVRAG_PASSWORD;

    expect(
      email,
      'Set REVRAG_EMAIL in the local .env file'
    ).toBeTruthy();

    expect(
      password,
      'Set REVRAG_PASSWORD in the local .env file'
    ).toBeTruthy();

    const loginPage = new RevRagLoginPage(page);

    await loginPage.open();
    await loginPage.login(email, password);

    // Successful login should navigate away from the login route.
    await expect(page).not.toHaveURL(
      /\/login(?:[/?#]|$)/,
      { timeout: 20000 }
    );

    // The login form should no longer be displayed.
    await expect(loginPage.emailInput).toBeHidden();
    await expect(loginPage.passwordInput).toBeHidden();
  });


  // TC_LOGIN_003: Verify SDKs & Docs after login

  test('TC_LOGIN_003 - Verify SDKs & Docs after login', async ({ page }) => {
    const email = process.env.REVRAG_EMAIL;
    const password = process.env.REVRAG_PASSWORD;
  
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();
  
    const loginPage = new RevRagLoginPage(page);
  
    // Step 1: Open login page
    await loginPage.open();
  
    // Step 2: Log in
    await loginPage.login(email, password);
  
    // Step 3: Allow the page to finish its initial rendering
    await page.waitForTimeout(2000);
  
    // Step 4: Print diagnostic information
    console.log('Current URL:', page.url());
    console.log('Page title:', await page.title());
  
    const loginFormVisible = await loginPage.emailInput
      .isVisible()
      .catch(() => false);
  
    console.log('Login form still visible:', loginFormVisible);
  
    // Step 5: Inspect the actual text shown on the page
    const pageText = await page.locator('body').innerText();
  
    console.log(
      'Visible page text (first 2500 characters):',
      pageText.slice(0, 2500)
    );
  
    // Step 6: Check whether the requested text exists
    const sdkDocs = page.getByText('SDKs / Docs', {
      exact: false
    });
  
    console.log('SDKs & Docs matching elements:', await sdkDocs.count());
  
    // Step 7: Save a screenshot in the test report
    const screenshot = await page.screenshot({
      fullPage: true
    });
  
    await test.info().attach('post-login-debug-screenshot', {
      body: screenshot,
      contentType: 'image/png'
    });
  
    // Step 8: Verify the requested section
    await expect(sdkDocs.first()).toBeVisible({
      timeout: 10000
    });
  });  


});
