
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  HelpCircle, 
  Clock, 
  Calendar, 
  CheckSquare, 
  BookOpen,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

// Mock data for leaderboard
const leaderboardData = [
  { id: '2', name: 'Alex Johnson', school: 'Springfield High', focusTime: 320 },
  { id: '1', name: 'Demo User', school: 'SolvynAI Academy', focusTime: 240 },
  { id: '3', name: 'Maria Garcia', school: 'Westside College', focusTime: 180 },
  { id: '4', name: 'James Wilson', school: 'North High School', focusTime: 165 },
  { id: '5', name: 'Sophia Lee', school: 'Eastside Academy', focusTime: 150 },
  { id: '6', name: 'William Brown', school: 'Central University', focusTime: 135 },
  { id: '7', name: 'Olivia Davis', school: 'Riverside School', focusTime: 120 },
  { id: '8', name: 'Emma Miller', school: 'South College', focusTime: 110 },
  { id: '9', name: 'Noah Taylor', school: 'Lakeside High', focusTime: 90 },
  { id: '10', name: 'Isabella Moore', school: 'Valley Institute', focusTime: 80 },
];

const Dashboard = () => {
  const { currentUser } = useAuth();
  
  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  const getUserRank = () => {
    if (!currentUser) return null;
    
    const sortedUsers = [...leaderboardData].sort((a, b) => b.focusTime - a.focusTime);
    const userRank = sortedUsers.findIndex(u => u.id === currentUser.id) + 1;
    
    return {
      rank: userRank || 'Unranked',
      total: sortedUsers.length
    };
  };
  
  const userRank = getUserRank();
  const quickActions = [
    {
      title: "Generate Question Paper",
      description: "Create custom question papers with AI",
      href: "/paper-generator",
      icon: FileText,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Solve Doubts",
      description: "Get instant help with your questions",
      href: "/doubt-solver",
      icon: HelpCircle,
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "Focus Mode",
      description: "Start a productive study session",
      href: "/focus",
      icon: Clock,
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "To-Do List",
      description: "Manage your tasks efficiently",
      href: "/todo",
      icon: Calendar,
      gradient: "from-orange-500 to-orange-600"
    },
    {
      title: "Answer Analysis",
      description: "Get detailed feedback on answers",
      href: "/answer-analyzer",
      icon: CheckSquare,
      gradient: "from-red-500 to-red-600"
    },
    {
      title: "Take a Quiz",
      description: "Test your knowledge",
      href: "/quiz",
      icon: BookOpen,
      gradient: "from-indigo-500 to-indigo-600"
    }
  ];
  
  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {currentUser?.fullName.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Ready to learn something new today?
        </p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Focus Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatFocusTime(currentUser?.focusTime || 0)}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-solvyn-500 to-accent2-500 rounded-full">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Rank</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  #{userRank?.rank || 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Institution</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {currentUser?.schoolName || 'Not Set'}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Access your most important tools and features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <a
                  key={action.href}
                  href={action.href}
                  className="group p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 bg-gradient-to-r ${action.gradient} rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-solvyn-600 dark:group-hover:text-solvyn-400 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Focus Leaderboard */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Focus Leaderboard
              </CardTitle>
              <CardDescription>
                Students ranked by total focus time this month
              </CardDescription>
            </div>
            {userRank && (
              <Badge variant="secondary" className="text-sm">
                Your Rank: #{userRank.rank} of {userRank.total}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboardData
              .sort((a, b) => b.focusTime - a.focusTime)
              .slice(0, 10)
              .map((user, index) => {
                const isCurrentUser = currentUser && user.id === currentUser.id;
                const getRankIcon = (rank: number) => {
                  if (rank === 0) return '🥇';
                  if (rank === 1) return '🥈';
                  if (rank === 2) return '🥉';
                  return `#${rank + 1}`;
                };
                
                return (
                  <div 
                    key={user.id} 
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                      isCurrentUser 
                        ? 'bg-gradient-to-r from-solvyn-50 to-accent2-50 dark:from-solvyn-900/20 dark:to-accent2-900/20 border border-solvyn-200 dark:border-solvyn-700' 
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 text-center font-semibold">
                        {getRankIcon(index)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                          {isCurrentUser && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              You
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.school}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatFocusTime(user.focusTime)}
                      </p>
                      <p className="text-xs text-gray-500">
                        focus time
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
