import { Bug, BugSeverity } from './bugDetector';

export interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
  issueType: string;
  autoCreateTickets: boolean;
}

export interface JiraTicket {
  id: string;
  key: string;
  summary: string;
  description: string;
  priority: string;
  status: string;
  assignee?: string;
  reporter: string;
  created: Date;
  updated: Date;
  url: string;
}

export interface CreateTicketRequest {
  summary: string;
  description: string;
  priority: string;
  issueType: string;
  projectKey: string;
  assignee?: string;
  labels?: string[];
}

export async function createJiraTicket(
  bug: Bug,
  config: JiraConfig
): Promise<JiraTicket> {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const priority = mapBugSeverityToJiraPriority(bug.severity);
    
    const ticketRequest: CreateTicketRequest = {
      summary: bug.title,
      description: formatBugDescriptionForJira(bug),
      priority,
      issueType: config.issueType,
      projectKey: config.projectKey,
      labels: ['automation', 'qa-tool', bug.category]
    };
    
    // Mock Jira ticket creation
    const mockTicket: JiraTicket = {
      id: `${Math.floor(Math.random() * 10000)}`,
      key: `${config.projectKey}-${Math.floor(Math.random() * 1000)}`,
      summary: ticketRequest.summary,
      description: ticketRequest.description,
      priority: ticketRequest.priority,
      status: 'Open',
      reporter: config.email,
      created: new Date(),
      updated: new Date(),
      url: `${config.baseUrl}/browse/${config.projectKey}-${Math.floor(Math.random() * 1000)}`
    };
    
    return mockTicket;
  } catch (error) {
    throw new Error(`Failed to create Jira ticket: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateJiraTicket(
  ticketKey: string,
  updates: Partial<CreateTicketRequest>,
  config: JiraConfig
): Promise<JiraTicket> {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock ticket update
    const mockTicket: JiraTicket = {
      id: `${Math.floor(Math.random() * 10000)}`,
      key: ticketKey,
      summary: updates.summary || 'Updated ticket',
      description: updates.description || 'Updated description',
      priority: updates.priority || 'Medium',
      status: 'In Progress',
      reporter: config.email,
      created: new Date(Date.now() - 86400000), // Yesterday
      updated: new Date(),
      url: `${config.baseUrl}/browse/${ticketKey}`
    };
    
    return mockTicket;
  } catch (error) {
    throw new Error(`Failed to update Jira ticket: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getJiraTicket(
  ticketKey: string,
  config: JiraConfig
): Promise<JiraTicket> {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock ticket retrieval
    const mockTicket: JiraTicket = {
      id: `${Math.floor(Math.random() * 10000)}`,
      key: ticketKey,
      summary: 'Sample Jira Ticket',
      description: 'This is a sample ticket description',
      priority: 'High',
      status: 'Open',
      reporter: config.email,
      assignee: 'john.doe@example.com',
      created: new Date(Date.now() - 86400000),
      updated: new Date(),
      url: `${config.baseUrl}/browse/${ticketKey}`
    };
    
    return mockTicket;
  } catch (error) {
    throw new Error(`Failed to get Jira ticket: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function testJiraConnection(config: JiraConfig): Promise<boolean> {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock connection test
    if (!config.baseUrl || !config.email || !config.apiToken) {
      throw new Error('Missing required configuration');
    }
    
    // Simulate successful connection
    return true;
  } catch (error) {
    console.error('Jira connection test failed:', error);
    return false;
  }
}

function mapBugSeverityToJiraPriority(severity: BugSeverity): string {
  switch (severity) {
    case 'critical':
      return 'Blocker';
    case 'major':
      return 'High';
    case 'minor':
      return 'Medium';
    case 'trivial':
      return 'Low';
    default:
      return 'Medium';
  }
}

function formatBugDescriptionForJira(bug: Bug): string {
  return `
*Bug Description:*
${bug.description}

*Steps to Reproduce:*
${bug.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

*Expected Result:*
${bug.expectedResult}

*Actual Result:*
${bug.actualResult}

*Additional Information:*
- URL: ${bug.url}
- Element: ${bug.element || 'N/A'}
- Category: ${bug.category}
- Test Case ID: ${bug.testCaseId || 'N/A'}
- Reporter: ${bug.reporter}
- Created: ${bug.createdAt.toISOString()}

${bug.screenshot ? `*Screenshot:* ${bug.screenshot}` : ''}
  `.trim();
}

export function getJiraPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'blocker':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function validateJiraConfig(config: Partial<JiraConfig>): string[] {
  const errors: string[] = [];
  
  if (!config.baseUrl) {
    errors.push('Base URL is required');
  } else if (!isValidUrl(config.baseUrl)) {
    errors.push('Base URL must be a valid URL');
  }
  
  if (!config.email) {
    errors.push('Email is required');
  } else if (!isValidEmail(config.email)) {
    errors.push('Email must be a valid email address');
  }
  
  if (!config.apiToken) {
    errors.push('API Token is required');
  }
  
  if (!config.projectKey) {
    errors.push('Project Key is required');
  }
  
  if (!config.issueType) {
    errors.push('Issue Type is required');
  }
  
  return errors;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}