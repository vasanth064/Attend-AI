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


test('Login to admin and create the client and delete it', async ({ page }) => {
  await page.goto('http://localhost:5173/signin');
  await page.getByPlaceholder('m@example.com').fill('test@test.com');
  await page.getByLabel('Password').fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('button', { name: 'Create Client' }).click();
  await page.getByPlaceholder('Enter name').click();
  await page.getByPlaceholder('Enter name').fill('Client 1');
  await page.getByPlaceholder('Enter name').press('Tab');
  await page.getByPlaceholder('Enter email').fill('client1@gmail.com');
  await page.getByPlaceholder('Enter password').click();
  await page.getByPlaceholder('Enter password').fill('1234');
  await page.getByRole('button', { name: 'Create new client' }).click();
  await page.getByRole('button', { name: 'View Clients' }).click();
  await page.getByRole('cell', { name: 'Client 1' }).click();
  expect(page.getByRole('cell', { name: 'Client 1' })).toBeVisible();
  await page.getByRole('row', { name: 'Client 1' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Delete' }).click();
});
