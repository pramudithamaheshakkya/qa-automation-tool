import { TestCase } from './testGenerator';

export type BugSeverity = 'critical' | 'major' | 'minor' | 'trivial';
export type BugStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type BugCategory = 'functional' | 'ui' | 'performance' | 'security' | 'usability';

export interface Bug {
  id: string;
  title: string;
  description: string;
  severity: BugSeverity;
  status: BugStatus;
  category: BugCategory;
  url: string;
  element?: string;
  screenshot?: string;
  steps: string[];
  expectedResult: string;
  actualResult: string;
  testCaseId?: string;
  jiraTicket?: string;
  createdAt: Date;
  updatedAt: Date;
  assignee?: string;
  reporter: string;
}

export interface TestExecution {
  id: string;
  testCaseId: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshot?: string;
  timestamp: Date;
}

export interface BugDetectionConfig {
  enableVisualTesting: boolean;
  enablePerformanceTesting: boolean;
  enableAccessibilityTesting: boolean;
  thresholds: {
    loadTime: number;
    visualDifference: number;
    accessibilityScore: number;
  };
}

export async function executeTests(testCases: TestCase[]): Promise<TestExecution[]> {
  const executions: TestExecution[] = [];
  
  for (const testCase of testCases) {
    try {
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock test results with some failures
      const shouldFail = Math.random() < 0.3; // 30% failure rate
      
      const execution: TestExecution = {
        id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        testCaseId: testCase.id,
        status: shouldFail ? 'failed' : 'passed',
        duration: Math.floor(Math.random() * 5000) + 1000,
        timestamp: new Date(),
        error: shouldFail ? generateMockError(testCase) : undefined,
        screenshot: shouldFail ? generateMockScreenshot() : undefined
      };
      
      executions.push(execution);
    } catch (error) {
      executions.push({
        id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        testCaseId: testCase.id,
        status: 'failed',
        duration: 0,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return executions;
}

export async function detectBugs(
  executions: TestExecution[],
  testCases: TestCase[],
  config: BugDetectionConfig
): Promise<Bug[]> {
  const bugs: Bug[] = [];
  
  const failedExecutions = executions.filter(exec => exec.status === 'failed');
  
  for (const execution of failedExecutions) {
    const testCase = testCases.find(tc => tc.id === execution.testCaseId);
    if (!testCase) continue;
    
    const bug = await createBugFromFailedTest(execution, testCase, config);
    bugs.push(bug);
  }
  
  // Add some mock visual and performance bugs
  if (config.enableVisualTesting) {
    bugs.push(...generateMockVisualBugs());
  }
  
  if (config.enablePerformanceTesting) {
    bugs.push(...generateMockPerformanceBugs());
  }
  
  if (config.enableAccessibilityTesting) {
    bugs.push(...generateMockAccessibilityBugs());
  }
  
  return bugs;
}

async function createBugFromFailedTest(
  execution: TestExecution,
  testCase: TestCase,
  config: BugDetectionConfig
): Promise<Bug> {
  const severity = determineBugSeverity(execution.error || '', testCase.priority);
  
  return {
    id: `bug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: `Test Failure: ${testCase.name}`,
    description: `Automated test "${testCase.name}" failed during execution.`,
    severity,
    status: 'open',
    category: mapTestCategoryToBugCategory(testCase.category),
    url: 'https://example.com',
    element: testCase.elements[0],
    screenshot: execution.screenshot,
    steps: [
      'Navigate to the test page',
      'Execute the automated test case',
      'Observe the failure'
    ],
    expectedResult: 'Test should pass without errors',
    actualResult: execution.error || 'Test failed with unknown error',
    testCaseId: testCase.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    reporter: 'QA Automation Tool'
  };
}

function determineBugSeverity(error: string, testPriority: string): BugSeverity {
  if (error.toLowerCase().includes('timeout') || error.toLowerCase().includes('not found')) {
    return 'critical';
  }
  if (error.toLowerCase().includes('assertion') || error.toLowerCase().includes('expected')) {
    return testPriority === 'high' ? 'major' : 'minor';
  }
  return 'minor';
}

function mapTestCategoryToBugCategory(testCategory: string): BugCategory {
  switch (testCategory) {
    case 'functional':
      return 'functional';
    case 'ui':
      return 'ui';
    case 'integration':
      return 'functional';
    default:
      return 'functional';
  }
}

function generateMockError(testCase: TestCase): string {
  const errors = [
    `Element not found: ${testCase.elements[0]}`,
    'Timeout waiting for element to be visible',
    'Assertion failed: Expected "Success" but got "Error"',
    'Network request failed with status 500',
    'Element is not clickable at this point'
  ];
  
  return errors[Math.floor(Math.random() * errors.length)];
}

function generateMockScreenshot(): string {
  // Return a placeholder image URL
  return `https://via.placeholder.com/800x600/ff0000/ffffff?text=Test+Failed`;
}

function generateMockVisualBugs(): Bug[] {
  return [
    {
      id: 'visual-bug-1',
      title: 'Button alignment issue on mobile',
      description: 'Login button is misaligned on mobile devices',
      severity: 'minor',
      status: 'open',
      category: 'ui',
      url: 'https://example.com/login',
      element: '#login-btn',
      screenshot: 'https://via.placeholder.com/400x800/ffff00/000000?text=Mobile+Layout+Issue',
      steps: [
        'Open the login page on mobile device',
        'Observe the button alignment',
        'Compare with desktop version'
      ],
      expectedResult: 'Button should be centered and properly aligned',
      actualResult: 'Button appears off-center and overlaps with other elements',
      createdAt: new Date(),
      updatedAt: new Date(),
      reporter: 'Visual Testing Tool'
    }
  ];
}

function generateMockPerformanceBugs(): Bug[] {
  return [
    {
      id: 'perf-bug-1',
      title: 'Slow page load time',
      description: 'Homepage takes more than 5 seconds to load',
      severity: 'major',
      status: 'open',
      category: 'performance',
      url: 'https://example.com',
      steps: [
        'Navigate to homepage',
        'Measure load time',
        'Compare with performance threshold'
      ],
      expectedResult: 'Page should load within 3 seconds',
      actualResult: 'Page loads in 6.2 seconds',
      createdAt: new Date(),
      updatedAt: new Date(),
      reporter: 'Performance Testing Tool'
    }
  ];
}

function generateMockAccessibilityBugs(): Bug[] {
  return [
    {
      id: 'a11y-bug-1',
      title: 'Missing alt text for images',
      description: 'Product images are missing alternative text for screen readers',
      severity: 'major',
      status: 'open',
      category: 'usability',
      url: 'https://example.com/products',
      element: 'img.product-image',
      steps: [
        'Navigate to products page',
        'Run accessibility audit',
        'Check image alt attributes'
      ],
      expectedResult: 'All images should have descriptive alt text',
      actualResult: '15 images are missing alt attributes',
      createdAt: new Date(),
      updatedAt: new Date(),
      reporter: 'Accessibility Testing Tool'
    }
  ];
}

export function getBugSeverityColor(severity: BugSeverity): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'major':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'minor':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'trivial':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getBugStatusColor(status: BugStatus): string {
  switch (status) {
    case 'open':
      return 'bg-red-100 text-red-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
    case 'closed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}