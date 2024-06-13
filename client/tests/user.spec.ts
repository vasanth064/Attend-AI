import { test, expect } from '@playwright/test';

test('Login to a sample user and View the search results', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.goto('http://localhost:5173/signin');
  await page.getByPlaceholder('m@example.com').click();
  await page.getByPlaceholder('m@example.com').fill('titi@test.com');
  await page.getByPlaceholder('m@example.com').press('Tab');
  await page.getByLabel('Password').fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('heading', { name: 'Hello sdfaewg' }).click();
  await page.getByRole('link', { name: 'Enrollments' }).click();
  await page.getByRole('heading', { name: 'Enrolled Sessions' }).click();
  await page.getByRole('link', { name: 'Report' }).click();
  await page.getByLabel('Start Time').click();
  await page.getByRole('gridcell', { name: '1', exact: true }).first().click();
  await page.getByText('Welcome: sdfaewgStart').click();
  await page.getByLabel('End Time').click();
  await page.getByRole('gridcell', { name: '25' }).click();
  await page.getByText('Start TimeJune 1st, 2024End TimeJune 25th, 2024SearchCurrently, there are no').click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('cell', { name: 'Present' }).click();
  await page.getByRole('button', { name: 'Toggle user menu' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
});
