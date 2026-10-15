
const base = require('@playwright/test');

const test = base.test.extend({
  failureScreenshot: [
    async ({ page }, use, testInfo) => {
      await use();

      // Capture a screenshot whenever a test fails
      if (testInfo.status !== testInfo.expectedStatus) {
        try {
          const screenshot = await page.screenshot({
            fullPage: true
          });

          // Attach the screenshot to the HTML test report
          await testInfo.attach('failure-screenshot', {
            body: screenshot,
            contentType: 'image/png'
          });

          console.log(
            `Failure screenshot captured: ${testInfo.title}`
          );
        } catch (error) {
          console.error(
            'Failed to capture screenshot:',
            error.message
          );
        }
      }
    },
    { auto: true }
  ]
});

module.exports = {
  test,
  expect: base.expect
};
