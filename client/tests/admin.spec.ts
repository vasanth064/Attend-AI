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


test('create a client and invite link', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.goto('http://localhost:5173/signin');
  await page.getByPlaceholder('m@example.com').click();
  await page.getByPlaceholder('m@example.com').fill('test@test.com');
  await page.getByPlaceholder('m@example.com').press('Tab');
  await page.getByLabel('Password').fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('button', { name: 'Create Client' }).click();
  await page.getByPlaceholder('Enter name').click();
  await page.getByPlaceholder('Enter name').fill('Client 1');
  await page.getByPlaceholder('Enter name').press('Tab');
  await page.getByPlaceholder('Enter email').fill('client1@gmail.com');
  await page.getByPlaceholder('Enter email').press('Tab');
  await page.getByPlaceholder('Enter password').fill('1234');
  await page.getByRole('button', { name: 'Create new client' }).click();
  await page.getByRole('button', { name: 'Toggle user menu' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await page.getByPlaceholder('m@example.com').click();
  await page.getByPlaceholder('m@example.com').fill('client1@gmail.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Invites' }).click();
  await page.getByRole('link', { name: 'Create Invite Link' }).click();
  await page.getByPlaceholder('Enter link name').click();
  await page.getByPlaceholder('Enter link name').fill('Invite 1');
  await page.getByPlaceholder('Enter label here').click();
  await page.getByPlaceholder('Enter label here').fill('dob');
  await page.getByRole('combobox').click();
  await page.getByLabel('Date', { exact: true }).click();
  await page.getByRole('button', { name: 'Add Field' }).click();
  await page.getByRole('button', { name: 'Create Invite Link' }).click();
  await page.getByText('Invite 1').click();
  await page.getByRole('row', { name: 'Select row Invite 1 Open Menu' }).getByRole('button').first().click();
  await page.getByRole('heading', { name: 'Invite' }).click();
  await page.getByRole('link', { name: 'Invites' }).click();
});


test('View the existing invite link', async ({ page }) => {
  await page.goto('http://localhost:5173/invite/1');
  await page.getByRole('heading', { name: 'Invite' }).click();
  await page.getByText('Name').click();
});


test('Login to the existing client and create a machine and log in to the machine', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.goto('http://localhost:5173/signin');
  await page.getByPlaceholder('m@example.com').click();
  await page.getByPlaceholder('m@example.com').fill('client2@gmail.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('heading', { name: 'Hello Client' }).click();
  await page.getByRole('link', { name: 'Sessions' }).click();
  await page.getByRole('link', { name: 'Machines' }).click();
  await page.getByRole('button', { name: 'Create Machine' }).click();
  await page.getByLabel('Machine Name').fill('Machine 2');
  await page.getByLabel('Email Address').click();
  await page.getByLabel('Email Address').fill('machine2@gmail.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('1234');
  await page.getByRole('button', { name: 'Create Machine' }).click();
  await page.getByRole('button', { name: 'Toggle user menu' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await page.getByPlaceholder('m@example.com').click();
  await page.getByPlaceholder('m@example.com').fill('machine2@gmail.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('heading', { name: 'Hello Machine' }).click();
  await page.getByRole('link', { name: 'Home' }).click();
  await page.getByRole('button', { name: 'Toggle user menu' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
});



test('Create a session and enroll the already created user into the session, view the enrollment in the user page', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.goto('http://localhost:5173/signin');
  await page.getByPlaceholder('m@example.com').click();
  await page.getByPlaceholder('m@example.com').fill('client2@gmail.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Sessions' }).click();
  await page.getByRole('button', { name: 'Create Session' }).click();
  await page.getByLabel('Name').fill('Session 1');
  await page.getByLabel('Name').press('Tab');
  await page.getByLabel('Start Date').fill('2024-08-06T00:00');
  await page.getByLabel('Start Date').press('Tab');
  await page.getByLabel('End Date').fill('2024-09-06T00:00');
  await page.getByRole('button', { name: 'Create Session' }).click();
  await page.getByText('Session 1').click();
  await page.getByRole('link', { name: 'Invites' }).click();
  await page.getByRole('row', { name: 'Select row Invite 1 Open Menu' }).getByRole('button').nth(1).click();
  await page.getByRole('button', { name: 'Approve' }).click();
  await page.getByRole('link', { name: 'Sessions' }).click();
  await page.getByRole('row', { name: 'Select row Session 1 2024-08-' }).getByRole('button').first().click();
  await page.getByRole('button', { name: 'Invite' }).click();
  await page.getByRole('button', { name: 'Assign' }).click();
  await page.getByText('User 1 has been assigned to').click();
  await page.getByText('User 1').nth(2).click();
  await page.getByRole('button', { name: 'Toggle user menu' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await page.getByPlaceholder('m@example.com').click();
  await page.getByPlaceholder('m@example.com').fill('user@test.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('heading', { name: 'Hello User' }).click();
  await page.getByRole('link', { name: 'Enrollments' }).click();
  await page.getByRole('cell', { name: 'Session 1' }).click();
  await page.getByRole('button', { name: 'Toggle user menu' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
});


