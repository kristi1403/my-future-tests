import {Page, Locator} from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly cookiesButton : Locator;

  constructor(page: Page) {
    this.page = page;
    this.cookiesButton = page.getByRole('button', { name: 'Consent' });
  }

  async navigate() {
    await this.page.goto('https://automationexercise.com');
  }

  async cookies() {
    await this.cookiesButton.click();
  }
}