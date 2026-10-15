
require('dotenv').config();

const { test, expect } = require('../fixtures/test');
const { RevRagLoginPage } = require('../pages/RevRagLoginPage');
const { AgentBuilderPage } = require('../pages/AgentBuilderPage');
test('TC_AGENT_001 - Create agent named QA Agent2', async ({ page }) => {
    test.setTimeout(90000);
  
    const email = process.env.REVRAG_EMAIL;
    const password = process.env.REVRAG_PASSWORD;
    const agentName = 'QA Agent2';
  
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();
  
    const loginPage = new RevRagLoginPage(page);
    const agentBuilder = new AgentBuilderPage(page);
  
    console.log('[Test] Step 1: Opening login page');
    await loginPage.open();
  
    console.log('[Test] Step 2: Submitting login');
    await loginPage.login(email, password);
  
    console.log('[Test] Step 3: Waiting for login form to disappear');
    await expect(loginPage.emailInput).toBeHidden({
      timeout: 20000
    });
  
    console.log('[Test] Step 4: Opening Agents');
    await agentBuilder.openAgentsSection();
  
    console.log('[Test] Step 5: Starting agent creation');
    await agentBuilder.clickCreateAgent();
  
    console.log('[Test] Step 6: Creating QA Agent2');
    await agentBuilder.createAgent(agentName);
  
    console.log('[Test] Step 7: Verifying created agent');
    await expect(
      page.getByText(agentName, { exact: true }).first()
    ).toBeVisible({ timeout: 20000 });
  
    console.log('[Test] PASS: Agent name is visible');
  });
  