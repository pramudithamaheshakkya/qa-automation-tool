import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  FileText, 
  Calendar,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Users, label: 'Team', active: false },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: FileText, label: 'Projects', active: false },
    { icon: Calendar, label: 'Calendar', active: false },
    { icon: Mail, label: 'Messages', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className={cn(
      "bg-card border-r transition-all duration-300 ease-in-out h-screen flex flex-col",
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className={cn(
          "flex items-center space-x-3",
          isCollapsed && "justify-center"
        )}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold">Dashboard</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isCollapsed && "justify-center px-0",
                item.active && "bg-primary text-primary-foreground"
              )}
            >
              <Icon className={cn(
                "w-5 h-5",
                !isCollapsed && "mr-3"
              )} />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t">
        <div className={cn(
          "flex items-center space-x-3",
          isCollapsed && "justify-center"
        )}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              JD
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;