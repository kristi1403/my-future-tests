import {Page, Locator} from '@playwright/test';

export interface SignupData {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export class SignupPage {
  readonly page: Page;
  readonly nameNew: Locator;
  readonly emailNew: Locator;
  readonly signupButton: Locator;
  readonly createPassword: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly address: Locator;
  readonly country: Locator;
  readonly state: Locator;
  readonly city: Locator;
  readonly zipcode: Locator;
  readonly mobileNumber: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameNew = page.getByRole('textbox', { name: 'Name' });
    this.emailNew = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address');
    this.signupButton = page.getByRole('button', { name: 'Signup' });
    this.createPassword = page.getByRole('textbox', { name: 'Password' });
    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name' });
    this.address = page.getByRole('textbox', { name: 'Address * (Street address, P.' });
    this.country = page.getByLabel('Country *');
    this.state = page.getByRole('textbox', { name: 'State' });
    this.city = page.getByRole('textbox', { name: 'City * Zipcode *' });
    this.zipcode = page.locator('#zipcode');
    this.mobileNumber = page.getByRole('textbox', { name: 'Mobile Number *' });
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
  }

  async signup(data: SignupData) {
    await this.nameNew.fill(data.name);
    await this.emailNew.fill(data.email);
    await this.signupButton.click();
    await this.createPassword.fill(data.password);
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.address.fill(data.address);
    await this.country.selectOption(data.country);
    await this.state.fill(data.state);
    await this.city.fill(data.city);
    await this.zipcode.fill(data.zipcode);
    await this.mobileNumber.fill(data.mobileNumber);
    await this.createAccountButton.click();
  }

  async generateRandomEmail(): Promise<string> {
    return `testuser${Date.now()}@example.com`;
  }
}
