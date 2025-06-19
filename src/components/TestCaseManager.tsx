import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Play, 
  Code, 
  Loader2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { 
  TestCase, 
  TestFramework, 
  generateTestCases, 
  downloadTestCase,
  GenerateTestsConfig 
} from '@/lib/testGenerator';
import { ScrapedElement } from '@/lib/scraper';

interface TestCaseManagerProps {
  elements: ScrapedElement[];
  onTestsGenerated: (testCases: TestCase[]) => void;
}

const TestCaseManager: React.FC<TestCaseManagerProps> = ({ elements, onTestsGenerated }) => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<TestFramework>('playwright');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);

  const handleGenerateTests = async () => {
    if (elements.length === 0) return;
    
    setIsGenerating(true);
    try {
      const config: GenerateTestsConfig = {
        elements,
        framework: selectedFramework,
        baseUrl: 'https://example.com',
        includeValidation: true,
        includeNegativeTests: true
      };
      
      const generatedTests = await generateTestCases(config);
      setTestCases(generatedTests);
      onTestsGenerated(generatedTests);
    } catch (error) {
      console.error('Test generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'functional': return 'bg-blue-100 text-blue-800';
      case 'ui': return 'bg-purple-100 text-purple-800';
      case 'integration': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Test Case Management
        </CardTitle>
        <CardDescription>
          Generate and manage automated test cases based on scraped elements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium">Test Framework</label>
            <Select value={selectedFramework} onValueChange={(value: TestFramework) => setSelectedFramework(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="playwright">Playwright</SelectItem>
                <SelectItem value="selenium">Selenium</SelectItem>
                <SelectItem value="cypress">Cypress</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleGenerateTests}
            disabled={isGenerating || elements.length === 0}
            className="mt-6"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Code className="w-4 h-4 mr-2" />
                Generate Tests
              </>
            )}
          </Button>
        </div>

        {elements.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No elements available. Please scrape a website first.</p>
          </div>
        )}

        {/* Test Cases */}
        {testCases.length > 0 && (
          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list">Test Cases ({testCases.length})</TabsTrigger>
              <TabsTrigger value="code">Code Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-4">
              <div className="grid gap-4">
                {testCases.map((testCase) => (
                  <Card key={testCase.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{testCase.name}</h4>
                            <Badge className={getPriorityColor(testCase.priority)}>
                              {testCase.priority}
                            </Badge>
                            <Badge className={getCategoryColor(testCase.category)}>
                              {testCase.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {testCase.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Framework: {testCase.framework}</span>
                            <span>Elements: {testCase.elements.length}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTestCase(testCase)}
                          >
                            <Code className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadTestCase(testCase)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="code">
              {selectedTestCase ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{selectedTestCase.name}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadTestCase(selectedTestCase)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{selectedTestCase.code}</code>
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a test case to view its code</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default TestCaseManager;