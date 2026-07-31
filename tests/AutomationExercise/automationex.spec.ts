import {test, expect} from '@playwright/test';
import {LoginPage} from '../../pages/AutomationExercise/LoginPage';
import {SignupPage} from '../../pages/AutomationExercise/Signup';
import {HomePage}from '../../pages/AutomationExercise/HomePage';


test('sign up with new account', async ({page}) => {
  const homePage = new HomePage(page);
  const signupPage = new SignupPage(page);
  await homePage.navigate();
  await homePage.cookies();
  await page.getByRole('link', {name: 'Signup / Login'}).click();
  await signupPage.signup('Anna Petrova', await signupPage.generateRandomEmail(), 'Test1234', 'Anna', 'Petrova', '123 Main St', 'Canada', 'Ontario', 'Toronto', 'M1A 2B3', '+1 123-456-7890');
  await expect(page.getByText('Account Created!')).toBeVisible();
});

test('sign in with correct data', async ({page}) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  await homePage.navigate();
  await homePage.cookies();
  await page.getByRole('link', {name: 'Signup / Login'}).click();
  await loginPage.login('test111222333@test.com', 'Test123');
  await expect(page.getByRole('link', { name: ' Logout' })).toBeVisible();
});

test('sign in with incorrect data', async ({page}) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  await homePage.navigate();
  await homePage.cookies();
  await page.getByRole('link', {name: 'Signup / Login'}).click();
  await loginPage.login('wrongemail@test.com', 'WrongPassword');
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
});

test('logout from the account', async ({page}) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  await homePage.navigate();
  await homePage.cookies();
  await page.getByRole('link', {name: 'Signup / Login'}).click();
  await loginPage.login('test111222333@test.com', 'Test123');
  await expect(page.getByRole('link', { name: ' Logout' })).toBeVisible();
  await page.getByRole('link', { name: ' Logout' }).click();
  await expect(page.getByRole('link', { name: ' Logout' })).not.toBeVisible();
});

test('delete account', async ({page}) => {
  const homePage = new HomePage(page);
  const signupPage = new SignupPage(page);
  await homePage.navigate();
  await homePage.cookies();
  await page.getByRole('link', {name: 'Signup / Login'}).click();
  await signupPage.signup('Anna Petrova', await signupPage.generateRandomEmail(), 'Test1234', 'Anna', 'Petrova', '123 Main St', 'Canada', 'Ontario', 'Toronto', 'M1A 2B3', '+1 123-456-7890');
  await expect(page.getByText('Account Created!')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();
  await page.getByRole('link', { name: ' Delete Account' }).click();
  await expect(page.getByText('Account Deleted!')).toBeVisible();
});