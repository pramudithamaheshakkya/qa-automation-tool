import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ExternalLink, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Plus,
  Eye
} from 'lucide-react';
import { 
  JiraConfig, 
  JiraTicket,
  createJiraTicket,
  testJiraConnection,
  validateJiraConfig,
  getJiraPriorityColor
} from '@/lib/jiraIntegration';
import { Bug } from '@/lib/bugDetector';

interface JiraIntegrationProps {
  bugs: Bug[];
}

const JiraIntegration: React.FC<JiraIntegrationProps> = ({ bugs }) => {
  const [config, setConfig] = useState<JiraConfig>({
    baseUrl: '',
    email: '',
    apiToken: '',
    projectKey: '',
    issueType: 'Bug',
    autoCreateTickets: false
  });
  
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [tickets, setTickets] = useState<JiraTicket[]>([]);
  const [selectedBug, setSelectedBug] = useState<string>('');

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const result = await testJiraConnection(config);
      setIsConnected(result);
    } catch (error) {
      setIsConnected(false);
      console.error('Connection test failed:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const handleCreateTicket = async (bug: Bug) => {
    setIsCreatingTicket(true);
    try {
      const ticket = await createJiraTicket(bug, config);
      setTickets(prev => [...prev, ticket]);
      
      // Update bug with Jira ticket reference
      bug.jiraTicket = ticket.key;
    } catch (error) {
      console.error('Failed to create Jira ticket:', error);
    } finally {
      setIsCreatingTicket(false);
    }
  };

  const handleBulkCreateTickets = async () => {
    const bugsWithoutTickets = bugs.filter(bug => !bug.jiraTicket);
    
    for (const bug of bugsWithoutTickets) {
      await handleCreateTicket(bug);
    }
  };

  const configErrors = validateJiraConfig(config);
  const isConfigValid = configErrors.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          Jira Integration
        </CardTitle>
        <CardDescription>
          Configure Jira integration to automatically create tickets for detected bugs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Jira Configuration
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Jira Base URL</label>
              <Input
                type="url"
                placeholder="https://your-domain.atlassian.net"
                value={config.baseUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="your-email@example.com"
                value={config.email}
                onChange={(e) => setConfig(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">API Token</label>
              <Input
                type="password"
                placeholder="Your Jira API token"
                value={config.apiToken}
                onChange={(e) => setConfig(prev => ({ ...prev, apiToken: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Key</label>
              <Input
                placeholder="PROJ"
                value={config.projectKey}
                onChange={(e) => setConfig(prev => ({ ...prev, projectKey: e.target.value.toUpperCase() }))}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Issue Type</label>
              <Select value={config.issueType} onValueChange={(value) => setConfig(prev => ({ ...prev, issueType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bug">Bug</SelectItem>
                  <SelectItem value="Task">Task</SelectItem>
                  <SelectItem value="Story">Story</SelectItem>
                  <SelectItem value="Epic">Epic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 mt-6">
              <Switch
                checked={config.autoCreateTickets}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoCreateTickets: checked }))}
              />
              <label className="text-sm font-medium">Auto-create tickets</label>
            </div>
          </div>
          
          {/* Configuration Errors */}
          {configErrors.length > 0 && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm font-medium text-destructive mb-2">Configuration Errors:</p>
              <ul className="text-sm text-destructive space-y-1">
                {configErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Test Connection */}
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleTestConnection}
              disabled={isTesting || !isConfigValid}
              variant="outline"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            
            {isConnected !== null && (
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Connected</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600">Connection Failed</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bug Ticket Management */}
        {bugs.length > 0 && isConnected && (
          <div className="space-y-4 pt-6 border-t">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Bug Tickets</h4>
              <Button 
                onClick={handleBulkCreateTickets}
                disabled={isCreatingTicket}
                size="sm"
              >
                {isCreatingTicket ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create All Tickets
                  </>
                )}
              </Button>
            </div>
            
            <div className="grid gap-3">
              {bugs.map((bug) => (
                <div key={bug.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{bug.title}</span>
                      <Badge className={`text-xs ${bug.severity === 'critical' ? 'bg-red-100 text-red-800' : 
                        bug.severity === 'major' ? 'bg-orange-100 text-orange-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                        {bug.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{bug.description}</p>
                    {bug.jiraTicket && (
                      <div className="flex items-center gap-1 mt-2">
                        <ExternalLink className="w-3 h-3" />
                        <span className="text-xs text-blue-600">{bug.jiraTicket}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {bug.jiraTicket ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`${config.baseUrl}/browse/${bug.jiraTicket}`, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCreateTicket(bug)}
                        disabled={isCreatingTicket}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Create
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Created Tickets */}
        {tickets.length > 0 && (
          <div className="space-y-4 pt-6 border-t">
            <h4 className="text-sm font-medium">Recently Created Tickets</h4>
            <div className="grid gap-3">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{ticket.key}</span>
                          <Badge className={getJiraPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                          <Badge variant="outline">{ticket.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{ticket.summary}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Created: {ticket.created.toLocaleDateString()}</span>
                          <span>Reporter: {ticket.reporter}</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(ticket.url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Open
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {bugs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <ExternalLink className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No bugs detected yet. Run tests to detect bugs and create Jira tickets.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JiraIntegration;