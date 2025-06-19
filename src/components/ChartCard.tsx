import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartCardProps {
  title: string;
  subtitle: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle }) => {
  // Simulated chart data
  const data = [20, 35, 28, 45, 32, 48, 55, 42, 65, 38, 52, 60];
  const maxValue = Math.max(...data);

  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-between space-x-2">
          {data.map((value, index) => (
            <div
              key={index}
              className="flex-1 bg-primary rounded-t-sm hover:bg-primary/80 transition-all duration-300 cursor-pointer"
              style={{ height: `${(value / maxValue) * 100}%` }}
            />
          ))}
        </div>
        
        <div className="flex justify-between mt-4 text-xs text-muted-foreground">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;