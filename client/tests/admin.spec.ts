import { test, expect } from '@playwright/test';

test('Login to admin and verify the UI of logging in', async ({ page }) => {
  await page.goto('about:blank');
  await page.goto('http://localhost:5173/');
  await page.goto('http://localhost:5173/signin');
  await page.getByPlaceholder('m@example.com').click();
  await page.getByPlaceholder('m@example.com').fill('test@test.com');
  await page.getByPlaceholder('m@example.com').press('Tab');
  await page.getByLabel('Password').fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('heading', { name: 'client details' })).toBeVisible();
  await page.getByRole('button', { name: 'Create Client' }).click();
  await page.getByRole('button', { name: 'View Clients' }).click();
});
