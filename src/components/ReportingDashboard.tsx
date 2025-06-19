import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Bug } from '@/lib/bugDetector';
import { TestCase } from '@/lib/testGenerator';

interface ReportingDashboardProps {
  bugs: Bug[];
  testCases: TestCase[];
}

const ReportingDashboard: React.FC<ReportingDashboardProps> = ({ bugs, testCases }) => {
  // Calculate statistics
  const totalTests = testCases.length;
  const totalBugs = bugs.length;
  const criticalBugs = bugs.filter(bug => bug.severity === 'critical').length;
  const majorBugs = bugs.filter(bug => bug.severity === 'major').length;
  const minorBugs = bugs.filter(bug => bug.severity === 'minor').length;
  const openBugs = bugs.filter(bug => bug.status === 'open').length;
  const resolvedBugs = bugs.filter(bug => bug.status === 'resolved').length;

  // Mock test execution data
  const passRate = totalTests > 0 ? Math.max(0, 100 - (totalBugs / totalTests) * 100) : 0;

  // Chart data
  const severityData = [
    { name: 'Critical', value: criticalBugs, color: '#ef4444' },
    { name: 'Major', value: majorBugs, color: '#f97316' },
    { name: 'Minor', value: minorBugs, color: '#eab308' },
    { name: 'Trivial', value: bugs.filter(bug => bug.severity === 'trivial').length, color: '#6b7280' }
  ].filter(item => item.value > 0);

  const categoryData = [
    { name: 'Functional', count: bugs.filter(bug => bug.category === 'functional').length },
    { name: 'UI', count: bugs.filter(bug => bug.category === 'ui').length },
    { name: 'Performance', count: bugs.filter(bug => bug.category === 'performance').length },
    { name: 'Security', count: bugs.filter(bug => bug.category === 'security').length },
    { name: 'Usability', count: bugs.filter(bug => bug.category === 'usability').length }
  ].filter(item => item.count > 0);

  const handleExportReport = (format: 'pdf' | 'json' | 'html') => {
    const reportData = {
      summary: {
        totalTests,
        totalBugs,
        passRate: Math.round(passRate),
        criticalBugs,
        majorBugs,
        minorBugs,
        openBugs,
        resolvedBugs
      },
      bugs: bugs.map(bug => ({
        id: bug.id,
        title: bug.title,
        severity: bug.severity,
        status: bug.status,
        category: bug.category,
        url: bug.url,
        createdAt: bug.createdAt.toISOString(),
        jiraTicket: bug.jiraTicket
      })),
      testCases: testCases.map(tc => ({
        id: tc.id,
        name: tc.name,
        framework: tc.framework,
        priority: tc.priority,
        category: tc.category
      })),
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qa-report-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
                <p className="text-2xl font-bold">{totalTests}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
                <p className="text-2xl font-bold">{Math.round(passRate)}%</p>
                <Progress value={passRate} className="mt-2" />
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bugs</p>
                <p className="text-2xl font-bold">{totalBugs}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="destructive" className="text-xs">
                    {criticalBugs} Critical
                  </Badge>
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Issues</p>
                <p className="text-2xl font-bold">{openBugs}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {resolvedBugs} resolved
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bug Severity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Bug Severity Distribution</CardTitle>
            <CardDescription>Breakdown of bugs by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            {severityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No bugs detected yet</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bug Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Bug Categories</CardTitle>
            <CardDescription>Distribution of bugs by category</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <BarChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No bug categories to display</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Bugs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Bugs</CardTitle>
              <CardDescription>Latest detected bugs and their status</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExportReport('json')}>
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportReport('pdf')}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {bugs.length > 0 ? (
            <div className="space-y-4">
              {bugs.slice(0, 10).map((bug) => (
                <div key={bug.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{bug.title}</h4>
                      <Badge 
                        variant={bug.severity === 'critical' ? 'destructive' : 'secondary'}
                        className={
                          bug.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          bug.severity === 'major' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {bug.severity}
                      </Badge>
                      <Badge variant="outline">{bug.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{bug.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{bug.createdAt.toLocaleDateString()}</span>
                      <span>{bug.category}</span>
                      {bug.jiraTicket && (
                        <div className="flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          <span>{bug.jiraTicket}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {bugs.length > 10 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing 10 of {bugs.length} bugs. Export full report for complete data.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No bugs to display. Run tests to generate bug reports.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingDashboard;