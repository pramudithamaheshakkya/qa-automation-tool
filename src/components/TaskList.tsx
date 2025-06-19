import React from 'react';
import { CheckCircle2, Circle, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TaskList: React.FC = () => {
  const tasks = [
    {
      id: 1,
      title: 'Update user dashboard',
      description: 'Implement new analytics widgets',
      completed: false,
      priority: 'high',
      dueDate: 'Today',
      assignee: 'JD'
    },
    {
      id: 2,
      title: 'Review code changes',
      description: 'Check pull request #127',
      completed: true,
      priority: 'medium',
      dueDate: 'Yesterday',
      assignee: 'SM'
    },
    {
      id: 3,
      title: 'Client meeting preparation',
      description: 'Prepare presentation slides',
      completed: false,
      priority: 'high',
      dueDate: 'Tomorrow',
      assignee: 'AB'
    },
    {
      id: 4,
      title: 'Database optimization',
      description: 'Improve query performance',
      completed: false,
      priority: 'low',
      dueDate: 'Next week',
      assignee: 'JD'
    },
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Tasks</CardTitle>
        <Button variant="ghost" size="sm">
          View all
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className={cn(
            "p-4 rounded-lg border transition-all duration-200 hover:shadow-sm",
            task.completed ? 'bg-muted/50 border-muted' : 'bg-card border-border hover:border-border/80'
          )}>
            <div className="flex items-start space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 mt-0.5"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                )}
              </Button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={cn(
                      "text-sm font-medium",
                      task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                    )}>
                      {task.title}
                    </h4>
                    <p className={cn(
                      "text-sm mt-1",
                      task.completed ? 'text-muted-foreground/70' : 'text-muted-foreground'
                    )}>
                      {task.description}
                    </p>
                  </div>
                  
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                    priorityColors[task.priority as keyof typeof priorityColors]
                  )}>
                    {task.priority}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{task.dueDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{task.assignee}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TaskList;