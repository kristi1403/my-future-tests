import {Page, Locator} from '@playwright/test';

export class SignupPage {
  readonly page: Page;
  readonly nameNew!: Locator;
  readonly emailNew!: Locator;
  readonly signupButton!: Locator;
  readonly createPassword!: Locator;
  readonly firstName!: Locator;
  readonly lastName!: Locator;
  readonly address!: Locator;
  readonly country!: Locator;
  readonly state!: Locator
  readonly city!: Locator;
  readonly zipcode!: Locator;
  readonly mobileNumber!: Locator




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


  }


  async signup(name: string, email: string, password: string, firstName: string, lastName: string, address: string, country: string, state: string, city: string, zipcode: string, mobileNumber: string) {
    await this.nameNew.fill(name);
    await this.emailNew.fill(email);
    await this.signupButton.click();
    await this.createPassword.fill(password);
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.address.fill(address);
    await this.country.selectOption(country);
    await this.state.fill(state);
    await this.city.fill(city);
    await this.zipcode.fill(zipcode);
    await this.mobileNumber.fill(mobileNumber);
    await this.page.getByRole('button', { name: 'Create Account' }).click();
  }



  async generateRandomEmail(): Promise<string> {
    return `testuser${Date.now()}@example.com`;
  }

}

