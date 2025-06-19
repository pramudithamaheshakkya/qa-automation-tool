import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bug, 
  AlertTriangle, 
  Play, 
  Loader2, 
  ExternalLink,
  Filter,
  Eye,
  Clock,
  User
} from 'lucide-react';
import { 
  Bug as BugType, 
  TestExecution, 
  BugDetectionConfig,
  executeTests,
  detectBugs,
  getBugSeverityColor,
  getBugStatusColor
} from '@/lib/bugDetector';
import { TestCase } from '@/lib/testGenerator';

interface BugDetectionLogsProps {
  testCases: TestCase[];
  onBugsDetected: (bugs: BugType[]) => void;
}

const BugDetectionLogs: React.FC<BugDetectionLogsProps> = ({ testCases, onBugsDetected }) => {
  const [bugs, setBugs] = useState<BugType[]>([]);
  const [executions, setExecutions] = useState<TestExecution[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedBug, setSelectedBug] = useState<BugType | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const config: BugDetectionConfig = {
    enableVisualTesting: true,
    enablePerformanceTesting: true,
    enableAccessibilityTesting: true,
    thresholds: {
      loadTime: 3000,
      visualDifference: 0.1,
      accessibilityScore: 90
    }
  };

  const handleRunTests = async () => {
    if (testCases.length === 0) return;
    
    setIsRunning(true);
    try {
      // Execute tests
      const testExecutions = await executeTests(testCases);
      setExecutions(testExecutions);
      
      // Detect bugs from failed tests
      const detectedBugs = await detectBugs(testExecutions, testCases, config);
      setBugs(detectedBugs);
      onBugsDetected(detectedBugs);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const filteredBugs = bugs.filter(bug => {
    if (filterSeverity !== 'all' && bug.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && bug.status !== filterStatus) return false;
    return true;
  });

  const getExecutionStats = () => {
    const total = executions.length;
    const passed = executions.filter(e => e.status === 'passed').length;
    const failed = executions.filter(e => e.status === 'failed').length;
    const skipped = executions.filter(e => e.status === 'skipped').length;
    
    return { total, passed, failed, skipped };
  };

  const stats = getExecutionStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="w-5 h-5" />
          Bug Detection & Test Execution
        </CardTitle>
        <CardDescription>
          Execute automated tests and detect bugs with visual, performance, and accessibility testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Run Tests Button */}
        <div className="flex items-center justify-between">
          <Button 
            onClick={handleRunTests}
            disabled={isRunning || testCases.length === 0}
            size="lg"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run All Tests
              </>
            )}
          </Button>
          
          {executions.length > 0 && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>{stats.passed} Passed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>{stats.failed} Failed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span>{stats.skipped} Skipped</span>
              </div>
            </div>
          )}
        </div>

        {testCases.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No test cases available. Please generate test cases first.</p>
          </div>
        )}

        {/* Results */}
        {bugs.length > 0 && (
          <Tabs defaultValue="bugs" className="w-full">
            <TabsList>
              <TabsTrigger value="bugs">Detected Bugs ({bugs.length})</TabsTrigger>
              <TabsTrigger value="executions">Test Executions ({executions.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bugs" className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="trivial">Trivial</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bug List */}
              <div className="grid gap-4">
                {filteredBugs.map((bug) => (
                  <Card key={bug.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{bug.title}</h4>
                            <Badge className={getBugSeverityColor(bug.severity)}>
                              {bug.severity}
                            </Badge>
                            <Badge className={getBugStatusColor(bug.status)}>
                              {bug.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {bug.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{bug.createdAt.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{bug.reporter}</span>
                            </div>
                            {bug.jiraTicket && (
                              <div className="flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" />
                                <span>Jira: {bug.jiraTicket}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBug(bug)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          {bug.screenshot && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(bug.screenshot, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Screenshot
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="executions" className="space-y-4">
              <div className="grid gap-4">
                {executions.map((execution) => {
                  const testCase = testCases.find(tc => tc.id === execution.testCaseId);
                  return (
                    <Card key={execution.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{testCase?.name || 'Unknown Test'}</h4>
                              <Badge variant={execution.status === 'passed' ? 'default' : 'destructive'}>
                                {execution.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Duration: {execution.duration}ms</span>
                              <span>Executed: {execution.timestamp.toLocaleString()}</span>
                            </div>
                            {execution.error && (
                              <p className="text-sm text-destructive mt-2">{execution.error}</p>
                            )}
                          </div>
                          
                          {execution.screenshot && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(execution.screenshot, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Screenshot
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Bug Details Modal */}
        {selectedBug && (
          <Card className="border-2 border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bug className="w-5 h-5" />
                  Bug Details
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedBug(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">{selectedBug.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedBug.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Severity</label>
                  <Badge className={getBugSeverityColor(selectedBug.severity)}>
                    {selectedBug.severity}
                  </Badge>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <Badge className={getBugStatusColor(selectedBug.status)}>
                    {selectedBug.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-muted-foreground">Steps to Reproduce</label>
                <ol className="text-sm mt-1 space-y-1">
                  {selectedBug.steps.map((step, index) => (
                    <li key={index}>{index + 1}. {step}</li>
                  ))}
                </ol>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Expected Result</label>
                  <p className="text-sm">{selectedBug.expectedResult}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Actual Result</label>
                  <p className="text-sm">{selectedBug.actualResult}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default BugDetectionLogs;