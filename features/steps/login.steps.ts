import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';

Given('I open the store homepage', async ({ page }) => {
  await page.goto('https://storedemo.testdino.com/');
});

Then('the page title should contain {string}', async ({ page }, text: string) => {
  await expect(page).toHaveTitle(new RegExp(text));
});

When('I search for {string}', async ({ page }, searchTerm: string) => {
  await page.getByPlaceholder('Search products...').fill(searchTerm);
  await page.keyboard.press('Enter');
});

Then('I should see search results', async ({ page }) => {
  await expect(page.locator('.product-card').first()).toBeVisible();
});

When('I add the first product to the cart', async ({ page }) => {
  await page.locator('button', { hasText: 'Add to Cart' }).first().click();
});

Then('the cart count should be greater than zero', async ({ page }) => {
  const cartCount = page.locator('.cart-count');
  await expect(cartCount).not.toHaveText('0');
});
