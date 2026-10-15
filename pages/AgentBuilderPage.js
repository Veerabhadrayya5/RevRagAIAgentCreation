
class AgentBuilderPage {
    constructor(page) {
      this.page = page;
    }
  
    // Find the first visible element from the provided locators.
    async firstVisible(label, locators) {
      for (const locator of locators) {
        const count = await locator.count().catch(() => 0);
  
        for (let i = 0; i < count; i++) {
          const candidate = locator.nth(i);
  
          if (await candidate.isVisible().catch(() => false)) {
            return candidate;
          }
        }
      }
  
      throw new Error(
        `Could not find visible "${label}". URL: ${this.page.url()}`
      );
    }
  
    // Click an element with useful terminal logging.
    async clickControl(label, locators) {
      const locator = await this.firstVisible(label, locators);
  
      console.log(`[Agent Creation] Clicking: ${label}`);
  
      await locator.click({ timeout: 10000 });
  
      console.log(`[Agent Creation] Click completed: ${label}`);
    }
  
    // Open Agents unless already on the Agents page.
    async openAgentsSection() {
      const currentUrl = new URL(this.page.url());
  
      if (/\/agent\/?$/i.test(currentUrl.pathname)) {
        console.log('[Agent Creation] Already on Agents page.');
        return;
      }
  
      await this.clickControl('Agents section', [
        this.page.getByRole('button', {
          name: 'Agents',
          exact: true
        }),
        this.page.getByRole('link', {
          name: 'Agents',
          exact: true
        })
      ]);
    }
  
    // Open the Create an Agent popup.
    async clickCreateAgent() {
      await this.clickControl('Create an Agent', [
        this.page.getByRole('button', {
          name: /create an agent/i
        }),
        this.page.getByText('Create an Agent', {
          exact: true
        })
      ]);
    }
  
    // Open a dropdown and select the requested option.
    async selectDropdownOption(label, field, optionText) {
      await field.waitFor({
        state: 'visible',
        timeout: 10000
      });
  
      await field.click({ timeout: 10000 });
  
      console.log(`[Agent Creation] Opened dropdown: ${label}`);
  
      // Allow the custom dropdown options to render.
      await this.page.waitForTimeout(300);
  
      // Match the option without being sensitive to capitalization.
      const escapedText = optionText.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );
  
      const optionRegex = new RegExp(escapedText, 'i');
  
      // Search the whole page because dropdown options may be
      // rendered outside the popup.
      const option = await this.firstVisible(
        `${label} option: ${optionText}`,
        [
          this.page.getByRole('option', {
            name: optionRegex
          }),
          this.page.getByRole('menuitem', {
            name: optionRegex
          }),
          this.page.getByRole('button', {
            name: optionRegex
          }),
          this.page.getByText(optionRegex, {
            exact: true
          })
        ]
      );
  
      await option.click({ timeout: 10000 });
  
      console.log(
        `[Agent Creation] Selected ${label}: ${optionText}`
      );
    }
  
    // Fill out the Create an Agent popup and create the agent.
    async createAgent(agentName) {
      // Use the dialog as the root if one is available.
      const dialogs = this.page.getByRole('dialog');
  
      let root = this.page;
  
      if (
        await dialogs.count() > 0 &&
        await dialogs.last().isVisible().catch(() => false)
      ) {
        root = dialogs.last();
      }
  
      // Locators based on the actual controls from your diagnostics.
      const nameField = root.getByPlaceholder(
        'Enter your agent name',
        { exact: true }
      );
  
      const typeDropdown = root
        .getByRole('combobox')
        .filter({ hasText: /^Select$/ });
  
      const descriptionField = root.getByPlaceholder(
        'Describe what this agent should do',
        { exact: true }
      );
  
      const useCasesDropdown = root
        .getByRole('combobox')
        .filter({ hasText: /Select use cases/i });
  
      // Step 1: Enter agent name.
      await nameField.fill(agentName, {
        timeout: 10000
      });
  
      console.log(
        `[Agent Creation] Name entered: ${agentName}`
      );
  
      // Step 2: Select AI Calling Multi-Agent.
      await this.selectDropdownOption(
        'Agent type',
        typeDropdown,
        'AI Calling Multi-Agent'
      );
  
      // Step 3: Enter the description.
      const description =
        'An AI calling multi-agent workflow for customer onboarding. ' +
        'Guide users through onboarding steps, answer common questions, ' +
        'collect required information, and help resolve onboarding issues.';
  
      await descriptionField.fill(description, {
        timeout: 10000
      });
  
      console.log('[Agent Creation] Description entered.');
  
      // Step 4: Select Onboarding as the use case.
      await this.selectDropdownOption(
        'Use cases',
        useCasesDropdown,
        'Onboarding'
      );
  
      // Step 5: Find Create across the entire page.
      // The button may be outside the accessible dialog container.
      const createButton = await this.firstVisible(
        'Create button',
        [
          this.page.getByRole('button', {
            name: 'Create',
            exact: true
          }),
          this.page.locator('button').filter({
            hasText: /^\s*Create\s*$/
          })
        ]
      );
  
      console.log('[Agent Creation] Clicking Create button.');
  
      await createButton.click({ timeout: 10000 });
  
      console.log('[Agent Creation] Create button clicked.');
    }
  }
  
  module.exports = { AgentBuilderPage };
  