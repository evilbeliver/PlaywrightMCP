import { test, expect } from '@playwright/test';

/**
 * BDD Test: Eligibility Check for Silver&Fit Program
 * 
 * User Journey: First-time visitor checking eligibility for the Silver&Fit program
 * with user information that results in ineligibility
 */

test.describe('Silver&Fit Eligibility Check', () => {

  test('should display ineligibility message when user cannot be confirmed as eligible', async ({ page }) => {
    // Given: This is the first time visiting silverandfit.com and looking to 
    // learn if I am eligible to use this product
    await page.goto('https://www.silverandfit.com');
    
    // Verify we are on the homepage
    await expect(page).toHaveTitle(/Silver&Fit/);

    // When: I click on the "Check Eligibility" button
    await page.getByRole('link', { name: 'CHECK ELIGIBILITY' }).click();

    // Verify I am taken to the registration page
    await expect(page).toHaveURL('https://www.silverandfit.com/identity/registration');
    await expect(page.getByRole('heading', { name: 'Create an Account' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Step 1 of 2' })).toBeVisible();

    // When: I enter the following information into the "Create an Account" form
    // First Name - Dave
    await page.getByRole('textbox', { name: 'First Name' }).fill('Dave');
    
    // Last Name - Cristinzio
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Cristinzio');
    
    // Month - 02
    await page.getByRole('textbox', { name: 'Month' }).fill('02');
    
    // Day - 10
    await page.getByRole('textbox', { name: 'Day' }).fill('10');
    
    // Year - 1975
    await page.getByRole('textbox', { name: 'Year' }).fill('1975');
    
    // Zip Code - 29073
    await page.getByRole('textbox', { name: 'Zip Code' }).fill('29073');

    // Click "I have read and agree to the Terms and Conditions"
    await page.getByRole('checkbox', { name: /I have read and agree to the Terms and Conditions/i }).check();

    // Verify the checkbox is checked
    await expect(page.getByRole('checkbox', { name: /I have read and agree to the Terms and Conditions/i })).toBeChecked();

    // Click "NEXT" button
    await page.getByRole('button', { name: 'NEXT' }).click();

    // Then: After clicking "NEXT", the user is presented with the ineligibility message
    const expectedMessage = "We're sorry, we are unable to confirm your eligibility. If you feel this is incorrect, please contact us at";
    const phoneNumber = "1-877-427-4788 (TTY/TDD 711)";
    
    await expect(page.getByText(expectedMessage)).toBeVisible();
    await expect(page.getByText(phoneNumber)).toBeVisible();
  });

});
