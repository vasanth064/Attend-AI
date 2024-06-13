import { test, expect } from '@playwright/test';

test('Logging into client', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.goto('http://localhost:5173/signin');
  await page.getByPlaceholder('m@example.com').click();
  await page.getByPlaceholder('m@example.com').fill('12345@test.com');
  await page.getByPlaceholder('m@example.com').press('Tab');
  await page.getByLabel('Password').fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('heading', { name: 'Hello JJClient' }).click();
  await page.getByRole('link', { name: 'Invites' }).click();
  await page.getByRole('heading', { name: 'Invite Links' }).click();
  await page.getByRole('link', { name: 'Machines' }).click();
  await page.getByRole('heading', { name: 'Machines' }).click();
  await page.getByRole('link', { name: 'Sessions' }).click();
  await page.getByRole('heading', { name: 'Sessions' }).click();
  await page.getByRole('button', { name: 'Toggle user menu' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
});



test('Create new invite link and delete it', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.goto('http://localhost:5173/signin');
  await page.getByPlaceholder('m@example.com').click();
  await page.getByPlaceholder('m@example.com').fill('12345@test.com');
  await page.getByPlaceholder('m@example.com').press('Tab');
  await page.getByLabel('Password').fill('1234');
  await page.getByLabel('Password').press('Enter');
  await page.getByRole('heading', { name: 'Hello JJClient' }).click();
  await page.getByRole('link', { name: 'Invites' }).click();
  await page.getByRole('heading', { name: 'Invite Links' }).click();
  await page.getByRole('link', { name: 'Create Invite Link' }).click();
  await page.getByPlaceholder('Enter link name').click();
  await page.getByPlaceholder('Enter link name').fill('Invite link 1');
  await page.getByPlaceholder('Enter link name').press('Tab');
  await page.getByPlaceholder('Enter label here').fill('Father\'s name');
  await page.getByRole('combobox').click();
  await page.getByLabel('Text').click();
  await page.getByRole('button', { name: 'Add Field' }).click();
  await page.getByRole('button', { name: 'Create Invite Link' }).click();
  await page.getByText('Invite link 1').click();
  await page.getByRole('row', { name: 'Select row Invite link 1 Open' }).getByRole('button').first().click();
  await page.getByRole('heading', { name: 'Invite link' }).click();
  await page.getByRole('link', { name: 'Invites' }).click();
  await page.getByRole('button', { name: 'Open Menu' }).nth(1).click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Toggle user menu' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
});


test('Creating sessions and Creating new machines', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.goto('http://localhost:5173/signin');
  await page.getByPlaceholder('m@example.com').click();
  await page.getByPlaceholder('m@example.com').fill('12345@test.com');
  await page.getByPlaceholder('m@example.com').press('Tab');
  await page.getByLabel('Password').fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Sessions' }).click();
  await page.getByRole('button', { name: 'Create Session' }).click();
  await page.getByLabel('Name').click();
  await page.getByLabel('Name').fill('New Session');
  await page.getByLabel('Name').press('Tab');
  await page.getByLabel('Start Date').press('Tab');
  await page.getByLabel('Start Date').press('Tab');
  await page.getByLabel('Start Date').press('Tab');
  await page.getByLabel('Start Date').fill('2024-06-01T00:00');
  await page.getByLabel('Start Date').press('Tab');
  await page.getByLabel('End Date').press('Tab');
  await page.getByLabel('End Date').press('Shift+Tab');
  await page.getByLabel('End Date').press('Tab');
  await page.getByLabel('End Date').press('Tab');
  await page.getByLabel('End Date').press('Tab');
  await page.getByLabel('End Date').fill('2024-06-30T00:00');
  await page.getByRole('button', { name: 'Create Session' }).click();
  await page.getByText('New Session').click();
  await page.getByRole('button', { name: 'Open Menu' }).nth(2).click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByText('Attend AIHomeSessionsInvitesMachines').click();
  await page.getByRole('link', { name: 'Machines' }).click();
  await page.getByRole('button', { name: 'Create Machine' }).click();
  await page.getByLabel('Machine Name').fill('Machine 2');
  await page.getByLabel('Machine Name').press('Tab');
  await page.getByLabel('Email Address').fill('machine3@gmail.com');
  await page.getByLabel('Email Address').press('Tab');
  await page.getByLabel('Password').fill('1234');
  await page.getByRole('button', { name: 'Create Machine' }).click();
  await page.getByRole('row', { name: 'Select row Machine 2 machine3' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.locator('html').click();
  await page.getByRole('button', { name: 'Toggle user menu' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
});


test('Testing an existing invite link', async ({ page }) => {
  await page.goto('http://localhost:5173/invite/1');
  await page.getByRole('heading', { name: 'KCT Students enrollment link' }).click();
  await page.getByText('Name').click();
  await page.getByText('Email').click();
});
