
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarProvider, Sidebar as SidebarComponent, SidebarContent, SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  Home, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Clock, 
  HelpCircle,
  User,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';

const LogoLight = () => (
  <div className="text-xl font-bold text-solvyn-600 flex items-center gap-2">
    <span className="bg-gradient-to-r from-solvyn-500 to-accent2-500 text-transparent bg-clip-text">SolvynAI</span>
  </div>
);

const LogoDark = () => (
  <div className="text-xl font-bold text-white flex items-center gap-2">
    <span className="bg-gradient-to-r from-solvyn-400 to-accent2-400 text-transparent bg-clip-text">SolvynAI</span>
  </div>
);

export const AppSidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/paper-generator', label: 'Question Papers', icon: FileText },
    { path: '/answer-analyzer', label: 'Answer Analysis', icon: CheckSquare },
    { path: '/doubt-solver', label: 'Doubt Solver', icon: HelpCircle },
    { path: '/todo', label: 'To-Do List', icon: Calendar },
    { path: '/focus', label: 'Focus Mode', icon: Clock },
    { path: '/quiz', label: 'Quiz', icon: BookOpen },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <SidebarComponent className="border-r">
      <div className="px-3 py-2 h-16 flex items-center border-b">
        {theme === 'light' ? <LogoLight /> : <LogoDark />}
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <nav className="space-y-1 py-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-solvyn-100 text-solvyn-900 dark:bg-slate-800 dark:text-white'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={18} className={`mr-3 ${isActive ? 'text-solvyn-500 dark:text-accent2-400' : ''}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <div className="mt-auto border-t p-3 space-y-3">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
          
          <Link to="/profile">
            <Button variant="ghost" className="text-sm" aria-label="Profile">
              <div className="flex items-center space-x-2">
                {currentUser && (
                  <>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-solvyn-500 to-accent2-500 flex items-center justify-center text-white font-medium">
                      {getInitials(currentUser.fullName)}
                    </div>
                    <span className="hidden sm:inline truncate max-w-[100px]">
                      {currentUser.fullName.split(' ')[0]}
                    </span>
                  </>
                )}
              </div>
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <LogOut size={20} />
          </Button>
        </div>
      </div>
    </SidebarComponent>
  );
};

export const AppSidebarWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};
