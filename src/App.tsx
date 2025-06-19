import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Globe, 
  FileText, 
  Bug, 
  ExternalLink, 
  BarChart3,
  Settings,
  Zap
} from 'lucide-react';

import WebScrapingPanel from './components/WebScrapingPanel';
import TestCaseManager from './components/TestCaseManager';
import BugDetectionLogs from './components/BugDetectionLogs';
import JiraIntegration from './components/JiraIntegration';
import ReportingDashboard from './components/ReportingDashboard';

import { ScrapedElement } from './lib/scraper';
import { TestCase } from './lib/testGenerator';
import { Bug as BugType } from './lib/bugDetector';

function App() {
  const [scrapedElements, setScrapedElements] = useState<ScrapedElement[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [detectedBugs, setDetectedBugs] = useState<BugType[]>([]);

  const handleElementsScraped = (elements: ScrapedElement[]) => {
    setScrapedElements(elements);
  };

  const handleTestsGenerated = (tests: TestCase[]) => {
    setTestCases(tests);
  };

  const handleBugsDetected = (bugs: BugType[]) => {
    setDetectedBugs(bugs);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">QA Automation Tool</h1>
                <p className="text-sm text-muted-foreground">
                  Automated testing with web scraping, bug detection, and Jira integration
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                AI-Powered
              </Badge>
              <Badge variant="outline">
                v1.0.0
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Scraped Elements</p>
                  <p className="text-2xl font-bold">{scrapedElements.length}</p>
                </div>
                <Globe className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Test Cases</p>
                  <p className="text-2xl font-bold">{testCases.length}</p>
                </div>
                <FileText className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Detected Bugs</p>
                  <p className="text-2xl font-bold">{detectedBugs.length}</p>
                </div>
                <Bug className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jira Tickets</p>
                  <p className="text-2xl font-bold">
                    {detectedBugs.filter(bug => bug.jiraTicket).length}
                  </p>
                </div>
                <ExternalLink className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="scraping" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="scraping" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Web Scraping
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Test Cases
            </TabsTrigger>
            <TabsTrigger value="bugs" className="flex items-center gap-2">
              <Bug className="w-4 h-4" />
              Bug Detection
            </TabsTrigger>
            <TabsTrigger value="jira" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Jira Integration
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scraping" className="mt-6">
            <WebScrapingPanel onElementsScraped={handleElementsScraped} />
          </TabsContent>

          <TabsContent value="tests" className="mt-6">
            <TestCaseManager 
              elements={scrapedElements} 
              onTestsGenerated={handleTestsGenerated}
            />
          </TabsContent>

          <TabsContent value="bugs" className="mt-6">
            <BugDetectionLogs 
              testCases={testCases}
              onBugsDetected={handleBugsDetected}
            />
          </TabsContent>

          <TabsContent value="jira" className="mt-6">
            <JiraIntegration bugs={detectedBugs} />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <ReportingDashboard 
              bugs={detectedBugs}
              testCases={testCases}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2024 QA Automation Tool. Built with modern web technologies.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Powered by AI</span>
              <span>•</span>
              <span>Playwright</span>
              <span>•</span>
              <span>Jira API</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;