import {Page, Locator} from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly cookiesButton : Locator;
  readonly signupLoginLink : Locator;
  readonly logoutLink : Locator;

  constructor(page: Page) {
    this.page = page;
    this.cookiesButton = page.getByRole('button', { name: 'Consent' });
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  }

  async navigate() {
    await this.page.goto('https://automationexercise.com');
  }

  async cookies() {
    await this.cookiesButton.click();
  }

  async goToLoginPage() {
    await this.signupLoginLink.click();
  }

  async logout() {
    await this.logoutLink.click();
  }
}