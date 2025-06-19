export interface ScrapedElement {
  id: string;
  type: 'button' | 'input' | 'link' | 'form' | 'select' | 'textarea';
  selector: string;
  text?: string;
  attributes: Record<string, string>;
  xpath: string;
  position: { x: number; y: number };
}

export interface ScrapeConfig {
  url: string;
  selectors: string[];
  depth: number;
  includeHidden: boolean;
}

export interface ScrapeResult {
  url: string;
  elements: ScrapedElement[];
  timestamp: Date;
  status: 'success' | 'error';
  error?: string;
}

// Mock scraper function - in production, this would use Playwright/Puppeteer
export async function scrapePage(config: ScrapeConfig): Promise<ScrapeResult> {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock scraped elements
    const mockElements: ScrapedElement[] = [
      {
        id: '1',
        type: 'button',
        selector: '#login-btn',
        text: 'Login',
        attributes: { id: 'login-btn', class: 'btn btn-primary' },
        xpath: '//*[@id="login-btn"]',
        position: { x: 100, y: 200 }
      },
      {
        id: '2',
        type: 'input',
        selector: 'input[name="email"]',
        attributes: { name: 'email', type: 'email', placeholder: 'Enter email' },
        xpath: '//input[@name="email"]',
        position: { x: 50, y: 150 }
      },
      {
        id: '3',
        type: 'input',
        selector: 'input[name="password"]',
        attributes: { name: 'password', type: 'password', placeholder: 'Enter password' },
        xpath: '//input[@name="password"]',
        position: { x: 50, y: 180 }
      },
      {
        id: '4',
        type: 'link',
        selector: 'a[href="/signup"]',
        text: 'Sign Up',
        attributes: { href: '/signup', class: 'link' },
        xpath: '//a[@href="/signup"]',
        position: { x: 200, y: 220 }
      },
      {
        id: '5',
        type: 'form',
        selector: '#contact-form',
        attributes: { id: 'contact-form', method: 'POST' },
        xpath: '//*[@id="contact-form"]',
        position: { x: 0, y: 100 }
      }
    ];

    return {
      url: config.url,
      elements: mockElements,
      timestamp: new Date(),
      status: 'success'
    };
  } catch (error) {
    return {
      url: config.url,
      elements: [],
      timestamp: new Date(),
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export function generateElementSelector(element: ScrapedElement): string {
  // Priority: ID > Name > Class > XPath
  if (element.attributes.id) {
    return `#${element.attributes.id}`;
  }
  if (element.attributes.name) {
    return `[name="${element.attributes.name}"]`;
  }
  if (element.attributes.class) {
    return `.${element.attributes.class.split(' ')[0]}`;
  }
  return element.xpath;
}