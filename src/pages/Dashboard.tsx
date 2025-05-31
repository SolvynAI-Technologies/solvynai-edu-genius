
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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

interface LeaderboardEntry {
  id: string;
  full_name: string;
  school_name: string;
  focus_time: number;
  rank: number;
}

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  useEffect(() => {
    if (currentUser) {
      fetchUserProfile();
      fetchLeaderboard();
    }
  }, [currentUser]);
  
  const fetchUserProfile = async () => {
    if (!currentUser) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();
    
    setUserProfile(data);
  };
  
  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('focus_leaderboard')
      .select('*')
      .limit(10);
    
    setLeaderboard(data || []);
  };
  
  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  const getUserRank = () => {
    if (!currentUser || !leaderboard.length) return null;
    
    const userEntry = leaderboard.find(entry => entry.id === currentUser.id);
    return userEntry ? { rank: userEntry.rank, total: leaderboard.length } : null;
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
  
  if (!currentUser) {
    return (
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to SolvynAI! 🎓
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please log in to access your dashboard and start learning.
          </p>
          <a 
            href="/auth/login" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-solvyn-600 to-accent2-600 hover:from-solvyn-700 hover:to-accent2-700"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {userProfile?.full_name?.split(' ')[0] || 'Student'}! 👋
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
                  {formatFocusTime(userProfile?.focus_time || 0)}
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
                  {userProfile?.school_name || 'Not Set'}
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
            {leaderboard.map((user, index) => {
              const isCurrentUser = currentUser && user.id === currentUser.id;
              const getRankIcon = (rank: number) => {
                if (rank === 1) return '🥇';
                if (rank === 2) return '🥈';
                if (rank === 3) return '🥉';
                return `#${rank}`;
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
                      {getRankIcon(user.rank)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.full_name}
                        {isCurrentUser && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            You
                          </Badge>
                        )}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.school_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatFocusTime(user.focus_time)}
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
