import { test, expect } from '@playwright/test';

/**
 * BDD Test: Premium Fitness Network Multi-Location Enrollment FAQ
 * 
 * User Journey: First-time visitor seeking information about enrolling
 * at multiple premium fitness center locations
 */

test.describe('Premium Fitness Network Enrollment FAQ', () => {
  
  test('should display multi-location enrollment information when FAQ accordion is expanded', async ({ page }) => {
    // Given: This is the first time visiting silverandfit.com and looking to learn 
    // more information on if members can enroll at more than one premium fitness center
    await page.goto('https://www.silverandfit.com/faq');
    
    // Verify we are on the FAQ page
    await expect(page).toHaveTitle(/FAQ/i);
    await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible();

    // When: I navigate to the FAQ page and click on the accordion FAQ 
    // "Can members enroll at more than one premium fitness network location?"
    const faqButton = page.getByRole('button', { 
      name: 'Can members enroll at more than one Premium Fitness Network location?' 
    });
    
    // Verify the accordion button is visible and collapsed initially
    await expect(faqButton).toBeVisible();
    await expect(faqButton).toHaveAttribute('aria-expanded', 'false');
    
    // Click to expand the FAQ accordion
    await faqButton.click();

    // Then: After clicking to expand the FAQ, I am presented with the information
    // about members being able to join multiple premium locations
    await expect(faqButton).toHaveAttribute('aria-expanded', 'true');
    
    // Verify the expanded content contains the expected information
    const expectedAnswer = 'Yes, members can join multiple Premium locations, if available under their program. They will be responsible for paying the applicable fees for each location.';
    
    await expect(page.getByText(expectedAnswer)).toBeVisible();
  });

});
