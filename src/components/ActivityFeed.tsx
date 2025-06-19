import React from 'react';
import { Clock, User, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const ActivityFeed: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'user',
      icon: User,
      title: 'New user registered',
      description: 'Sarah Johnson joined the team',
      time: '5 minutes ago',
      color: 'blue'
    },
    {
      id: 2,
      type: 'task',
      icon: CheckCircle,
      title: 'Task completed',
      description: 'Website redesign project finished',
      time: '2 hours ago',
      color: 'green'
    },
    {
      id: 3,
      type: 'alert',
      icon: AlertCircle,
      title: 'System alert',
      description: 'Server maintenance scheduled for tonight',
      time: '4 hours ago',
      color: 'yellow'
    },
    {
      id: 4,
      type: 'document',
      icon: FileText,
      title: 'New report generated',
      description: 'Monthly analytics report is ready',
      time: '1 day ago',
      color: 'purple'
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <Clock className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
              <Avatar className="w-8 h-8">
                <AvatarFallback className={cn(
                  "w-8 h-8",
                  colorClasses[activity.color as keyof typeof colorClasses]
                )}>
                  <Icon className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
        
        <Button variant="ghost" className="w-full">
          View all activities
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;