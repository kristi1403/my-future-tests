# Playwright Test Automation Practice

A practice repository for learning UI test automation with [Playwright](https://playwright.dev/) and TypeScript, using the Page Object Model (POM) pattern.

## Stack

- **Playwright** + **TypeScript**
- **GitHub Actions** for CI — tests run automatically on every push/PR, across Chromium, Firefox, and WebKit

## Structure

```
pages/      Page Object classes, grouped by site
tests/      Test specs, grouped by site
```

| Site | Covers |
|---|---|
| [the-internet.herokuapp.com](https://the-internet.herokuapp.com/login) | Login/logout flows, valid & invalid credentials |
| [saucedemo.com](https://www.saucedemo.com/) | Login, cart, product details, full checkout (end-to-end) flow |
| [wikipedia.org](https://www.wikipedia.org/) | Search functionality |

## Running the tests

```bash
npm install
npx playwright test          # run all tests headless
npx playwright test --ui     # run in interactive UI mode
npx playwright show-report   # view the HTML report after a run
```

## CI

Every push and pull request to `main` triggers the [Playwright Tests workflow](.github/workflows/playwright.yml), which runs the full suite across three browsers.
