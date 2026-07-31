import {test, expect, APIRequestContext} from '@playwright/test';
import {LoginPage} from '../../pages/AutomationExercise/LoginPage';
import {SignupPage, SignupData} from '../../pages/AutomationExercise/SignupPage';
import {HomePage} from '../../pages/AutomationExercise/HomePage';

const baseSignupData: Omit<SignupData, 'email'> = {
  name: 'Anna Petrova',
  password: 'Test1234',
  firstName: 'Anna',
  lastName: 'Petrova',
  address: '123 Main St',
  country: 'Canada',
  state: 'Ontario',
  city: 'Toronto',
  zipcode: 'M1A 2B3',
  mobileNumber: '+1 123-456-7890',
};

async function createApiUser(request: APIRequestContext) {
  const email = `testuser${Date.now()}_${Math.floor(Math.random() * 100000)}@example.com`;
  const password = 'Test1234';
  const response = await request.post('https://automationexercise.com/api/createAccount', {
    form: {
      name: 'Existing User',
      email,
      password,
      title: 'Mr',
      birth_date: '1',
      birth_month: '1',
      birth_year: '1990',
      firstname: 'Existing',
      lastname: 'User',
      company: 'QA',
      address1: '123 Main St',
      address2: '',
      country: 'Canada',
      zipcode: 'M1A2B3',
      state: 'Ontario',
      city: 'Toronto',
      mobile_number: '1234567890',
    },
  });
  const body = await response.json();
  if (body.responseCode !== 201) {
    throw new Error(`Failed to create API test user: ${JSON.stringify(body)}`);
  }
  return {email, password};
}

test.beforeEach(async ({page}) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
  await homePage.cookies();
  await homePage.goToLoginPage();
});

test('sign up with new account', async ({page}) => {
  const signupPage = new SignupPage(page);
  await signupPage.signup({...baseSignupData, email: await signupPage.generateRandomEmail()});
  await expect(page.getByText('Account Created!')).toBeVisible();
});

test('sign in with correct data', async ({page, request}) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const user = await createApiUser(request);
  await loginPage.login(user.email, user.password);
  await expect(homePage.logoutLink).toBeVisible();
});

test('sign in with incorrect data', async ({page}) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('wrongemail@test.com', 'WrongPassword');
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
});

test('logout from the account', async ({page, request}) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const user = await createApiUser(request);
  await loginPage.login(user.email, user.password);
  await expect(homePage.logoutLink).toBeVisible();
  await homePage.logout();
  await expect(homePage.logoutLink).not.toBeVisible();
});

test('delete account', async ({page}) => {
  const signupPage = new SignupPage(page);
  await signupPage.signup({...baseSignupData, email: await signupPage.generateRandomEmail()});
  await expect(page.getByText('Account Created!')).toBeVisible();
  await page.getByRole('link', {name: 'Continue'}).click();
  await page.getByRole('link', {name: 'Delete Account'}).click();
  await expect(page.getByText('Account Deleted!')).toBeVisible();
});
