import { ScrapedElement } from './scraper';

export type TestFramework = 'playwright' | 'selenium' | 'cypress';

export interface TestCase {
  id: string;
  name: string;
  description: string;
  framework: TestFramework;
  code: string;
  elements: string[];
  priority: 'high' | 'medium' | 'low';
  category: 'functional' | 'ui' | 'integration';
}

export interface GenerateTestsConfig {
  elements: ScrapedElement[];
  framework: TestFramework;
  baseUrl: string;
  includeValidation: boolean;
  includeNegativeTests: boolean;
}

export async function generateTestCases(config: GenerateTestsConfig): Promise<TestCase[]> {
  const testCases: TestCase[] = [];
  
  // Generate basic interaction tests
  config.elements.forEach((element, index) => {
    switch (element.type) {
      case 'button':
        testCases.push(generateButtonTest(element, config.framework, config.baseUrl, index));
        break;
      case 'input':
        testCases.push(generateInputTest(element, config.framework, config.baseUrl, index));
        if (config.includeNegativeTests) {
          testCases.push(generateNegativeInputTest(element, config.framework, config.baseUrl, index));
        }
        break;
      case 'link':
        testCases.push(generateLinkTest(element, config.framework, config.baseUrl, index));
        break;
      case 'form':
        testCases.push(generateFormTest(element, config.framework, config.baseUrl, index));
        break;
    }
  });

  // Generate workflow tests
  const formElements = config.elements.filter(el => el.type === 'form');
  if (formElements.length > 0) {
    testCases.push(generateWorkflowTest(config.elements, config.framework, config.baseUrl));
  }

  return testCases;
}

function generateButtonTest(element: ScrapedElement, framework: TestFramework, baseUrl: string, index: number): TestCase {
  const selector = element.selector;
  
  const playwrightCode = `
import { test, expect } from '@playwright/test';

test('Button click test - ${element.text || 'Button'}', async ({ page }) => {
  await page.goto('${baseUrl}');
  await page.click('${selector}');
  // Add assertions here
  await expect(page).toHaveURL(/.*success.*/);
});`;

  const seleniumCode = `
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_button_click():
    driver = webdriver.Chrome()
    try:
        driver.get('${baseUrl}')
        button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, '${selector}'))
        )
        button.click()
        # Add assertions here
        assert 'success' in driver.current_url
    finally:
        driver.quit()`;

  const cypressCode = `
describe('Button Tests', () => {
  it('should click ${element.text || 'button'} successfully', () => {
    cy.visit('${baseUrl}');
    cy.get('${selector}').click();
    // Add assertions here
    cy.url().should('include', 'success');
  });
});`;

  const codeMap = {
    playwright: playwrightCode,
    selenium: seleniumCode,
    cypress: cypressCode
  };

  return {
    id: `btn-test-${index}`,
    name: `Button Click Test - ${element.text || 'Button'}`,
    description: `Test clicking the ${element.text || 'button'} element`,
    framework,
    code: codeMap[framework],
    elements: [element.id],
    priority: 'high',
    category: 'functional'
  };
}

function generateInputTest(element: ScrapedElement, framework: TestFramework, baseUrl: string, index: number): TestCase {
  const selector = element.selector;
  const inputType = element.attributes.type || 'text';
  
  const playwrightCode = `
import { test, expect } from '@playwright/test';

test('Input field test - ${element.attributes.name || 'Input'}', async ({ page }) => {
  await page.goto('${baseUrl}');
  await page.fill('${selector}', 'test-value');
  const value = await page.inputValue('${selector}');
  expect(value).toBe('test-value');
});`;

  const seleniumCode = `
from selenium import webdriver
from selenium.webdriver.common.by import By

def test_input_field():
    driver = webdriver.Chrome()
    try:
        driver.get('${baseUrl}')
        input_field = driver.find_element(By.CSS_SELECTOR, '${selector}')
        input_field.send_keys('test-value')
        assert input_field.get_attribute('value') == 'test-value'
    finally:
        driver.quit()`;

  const cypressCode = `
describe('Input Tests', () => {
  it('should fill ${element.attributes.name || 'input'} field', () => {
    cy.visit('${baseUrl}');
    cy.get('${selector}').type('test-value');
    cy.get('${selector}').should('have.value', 'test-value');
  });
});`;

  const codeMap = {
    playwright: playwrightCode,
    selenium: seleniumCode,
    cypress: cypressCode
  };

  return {
    id: `input-test-${index}`,
    name: `Input Field Test - ${element.attributes.name || 'Input'}`,
    description: `Test filling the ${element.attributes.name || 'input'} field`,
    framework,
    code: codeMap[framework],
    elements: [element.id],
    priority: 'medium',
    category: 'functional'
  };
}

function generateNegativeInputTest(element: ScrapedElement, framework: TestFramework, baseUrl: string, index: number): TestCase {
  const selector = element.selector;
  
  const playwrightCode = `
import { test, expect } from '@playwright/test';

test('Negative input test - ${element.attributes.name || 'Input'}', async ({ page }) => {
  await page.goto('${baseUrl}');
  await page.fill('${selector}', '');
  // Try to submit form or trigger validation
  await page.click('button[type="submit"]');
  // Check for validation message
  const errorMessage = page.locator('.error, .invalid-feedback');
  await expect(errorMessage).toBeVisible();
});`;

  const seleniumCode = `
from selenium import webdriver
from selenium.webdriver.common.by import By

def test_negative_input():
    driver = webdriver.Chrome()
    try:
        driver.get('${baseUrl}')
        input_field = driver.find_element(By.CSS_SELECTOR, '${selector}')
        input_field.clear()
        submit_btn = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        submit_btn.click()
        error_msg = driver.find_element(By.CSS_SELECTOR, '.error, .invalid-feedback')
        assert error_msg.is_displayed()
    finally:
        driver.quit()`;

  const cypressCode = `
describe('Negative Input Tests', () => {
  it('should show validation error for empty ${element.attributes.name || 'input'}', () => {
    cy.visit('${baseUrl}');
    cy.get('${selector}').clear();
    cy.get('button[type="submit"]').click();
    cy.get('.error, .invalid-feedback').should('be.visible');
  });
});`;

  const codeMap = {
    playwright: playwrightCode,
    selenium: seleniumCode,
    cypress: cypressCode
  };

  return {
    id: `negative-input-test-${index}`,
    name: `Negative Input Test - ${element.attributes.name || 'Input'}`,
    description: `Test validation for empty ${element.attributes.name || 'input'} field`,
    framework,
    code: codeMap[framework],
    elements: [element.id],
    priority: 'medium',
    category: 'functional'
  };
}

function generateLinkTest(element: ScrapedElement, framework: TestFramework, baseUrl: string, index: number): TestCase {
  const selector = element.selector;
  const href = element.attributes.href || '#';
  
  const playwrightCode = `
import { test, expect } from '@playwright/test';

test('Link navigation test - ${element.text || 'Link'}', async ({ page }) => {
  await page.goto('${baseUrl}');
  await page.click('${selector}');
  await expect(page).toHaveURL('${href.startsWith('/') ? baseUrl + href : href}');
});`;

  const seleniumCode = `
from selenium import webdriver
from selenium.webdriver.common.by import By

def test_link_navigation():
    driver = webdriver.Chrome()
    try:
        driver.get('${baseUrl}')
        link = driver.find_element(By.CSS_SELECTOR, '${selector}')
        link.click()
        expected_url = '${href.startsWith('/') ? baseUrl + href : href}'
        assert driver.current_url == expected_url
    finally:
        driver.quit()`;

  const cypressCode = `
describe('Link Tests', () => {
  it('should navigate to ${element.text || 'link'} destination', () => {
    cy.visit('${baseUrl}');
    cy.get('${selector}').click();
    cy.url().should('eq', '${href.startsWith('/') ? baseUrl + href : href}');
  });
});`;

  const codeMap = {
    playwright: playwrightCode,
    selenium: seleniumCode,
    cypress: cypressCode
  };

  return {
    id: `link-test-${index}`,
    name: `Link Navigation Test - ${element.text || 'Link'}`,
    description: `Test navigation for ${element.text || 'link'} element`,
    framework,
    code: codeMap[framework],
    elements: [element.id],
    priority: 'low',
    category: 'functional'
  };
}

function generateFormTest(element: ScrapedElement, framework: TestFramework, baseUrl: string, index: number): TestCase {
  const selector = element.selector;
  
  const playwrightCode = `
import { test, expect } from '@playwright/test';

test('Form submission test', async ({ page }) => {
  await page.goto('${baseUrl}');
  
  // Fill form fields
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  
  // Submit form
  await page.click('${selector} button[type="submit"]');
  
  // Add assertions for successful submission
  await expect(page.locator('.success-message')).toBeVisible();
});`;

  const seleniumCode = `
from selenium import webdriver
from selenium.webdriver.common.by import By

def test_form_submission():
    driver = webdriver.Chrome()
    try:
        driver.get('${baseUrl}')
        
        # Fill form fields
        email_field = driver.find_element(By.CSS_SELECTOR, 'input[type="email"]')
        email_field.send_keys('test@example.com')
        
        password_field = driver.find_element(By.CSS_SELECTOR, 'input[type="password"]')
        password_field.send_keys('password123')
        
        # Submit form
        submit_btn = driver.find_element(By.CSS_SELECTOR, '${selector} button[type="submit"]')
        submit_btn.click()
        
        # Check for success message
        success_msg = driver.find_element(By.CSS_SELECTOR, '.success-message')
        assert success_msg.is_displayed()
    finally:
        driver.quit()`;

  const cypressCode = `
describe('Form Tests', () => {
  it('should submit form successfully', () => {
    cy.visit('${baseUrl}');
    
    // Fill form fields
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    
    // Submit form
    cy.get('${selector} button[type="submit"]').click();
    
    // Check for success
    cy.get('.success-message').should('be.visible');
  });
});`;

  const codeMap = {
    playwright: playwrightCode,
    selenium: seleniumCode,
    cypress: cypressCode
  };

  return {
    id: `form-test-${index}`,
    name: 'Form Submission Test',
    description: 'Test complete form submission workflow',
    framework,
    code: codeMap[framework],
    elements: [element.id],
    priority: 'high',
    category: 'integration'
  };
}

function generateWorkflowTest(elements: ScrapedElement[], framework: TestFramework, baseUrl: string): TestCase {
  const playwrightCode = `
import { test, expect } from '@playwright/test';

test('Complete user workflow test', async ({ page }) => {
  await page.goto('${baseUrl}');
  
  // Step 1: Fill login form
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password123');
  
  // Step 2: Submit form
  await page.click('#login-btn');
  
  // Step 3: Verify successful login
  await expect(page).toHaveURL(/.*dashboard.*/);
  
  // Step 4: Navigate to profile
  await page.click('a[href="/profile"]');
  
  // Step 5: Verify profile page
  await expect(page.locator('h1')).toContainText('Profile');
});`;

  const seleniumCode = `
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_complete_workflow():
    driver = webdriver.Chrome()
    try:
        driver.get('${baseUrl}')
        
        # Step 1: Fill login form
        email_field = driver.find_element(By.NAME, 'email')
        email_field.send_keys('user@example.com')
        
        password_field = driver.find_element(By.NAME, 'password')
        password_field.send_keys('password123')
        
        # Step 2: Submit form
        login_btn = driver.find_element(By.ID, 'login-btn')
        login_btn.click()
        
        # Step 3: Wait for dashboard
        WebDriverWait(driver, 10).until(
            EC.url_contains('dashboard')
        )
        
        # Step 4: Navigate to profile
        profile_link = driver.find_element(By.CSS_SELECTOR, 'a[href="/profile"]')
        profile_link.click()
        
        # Step 5: Verify profile page
        h1 = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, 'h1'))
        )
        assert 'Profile' in h1.text
    finally:
        driver.quit()`;

  const cypressCode = `
describe('Complete Workflow Tests', () => {
  it('should complete full user journey', () => {
    cy.visit('${baseUrl}');
    
    // Step 1: Fill login form
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('password123');
    
    // Step 2: Submit form
    cy.get('#login-btn').click();
    
    // Step 3: Verify dashboard
    cy.url().should('include', 'dashboard');
    
    // Step 4: Navigate to profile
    cy.get('a[href="/profile"]').click();
    
    // Step 5: Verify profile page
    cy.get('h1').should('contain', 'Profile');
  });
});`;

  const codeMap = {
    playwright: playwrightCode,
    selenium: seleniumCode,
    cypress: cypressCode
  };

  return {
    id: 'workflow-test-1',
    name: 'Complete User Workflow Test',
    description: 'End-to-end test covering login, navigation, and profile access',
    framework,
    code: codeMap[framework],
    elements: elements.map(el => el.id),
    priority: 'high',
    category: 'integration'
  };
}

export function downloadTestCase(testCase: TestCase): void {
  const fileExtension = testCase.framework === 'selenium' ? 'py' : 'js';
  const fileName = `${testCase.name.toLowerCase().replace(/\s+/g, '-')}.${fileExtension}`;
  
  const blob = new Blob([testCase.code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}