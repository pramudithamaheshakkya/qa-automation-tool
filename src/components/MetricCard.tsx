import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    purple: 'text-purple-600 bg-purple-100',
    red: 'text-red-600 bg-red-100',
  };

  const isPositive = change > 0;

  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          colorClasses[color]
        )}>
          <Icon className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={cn(
            "font-medium",
            isPositive ? 'text-green-600' : 'text-red-600'
          )}>
            {isPositive ? '+' : ''}{change}%
          </span>
          <span>vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;