
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

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
      rank: userRank,
      total: sortedUsers.length
    };
  };
  
  const userRank = getUserRank();
  
  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              {currentUser?.fullName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">School</span>
                <span className="font-medium">{currentUser?.schoolName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Focus Time</span>
                <span className="font-medium">{formatFocusTime(currentUser?.focusTime || 0)}</span>
              </div>
              {userRank && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Focus Rank</span>
                  <span className="font-medium">{userRank.rank} of {userRank.total}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Access your most important tools quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <a
                href="/paper-generator"
                className="bg-solvyn-50 dark:bg-slate-800 p-4 rounded-lg text-center hover:bg-solvyn-100 dark:hover:bg-slate-700 transition-colors group"
              >
                <div className="w-10 h-10 mx-auto mb-2 bg-solvyn-100 dark:bg-slate-700 rounded-full flex items-center justify-center group-hover:bg-solvyn-200 dark:group-hover:bg-slate-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-solvyn-600 dark:text-solvyn-300"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <h3 className="text-sm font-medium">Generate Question Paper</h3>
              </a>
              
              <a
                href="/doubt-solver"
                className="bg-solvyn-50 dark:bg-slate-800 p-4 rounded-lg text-center hover:bg-solvyn-100 dark:hover:bg-slate-700 transition-colors group"
              >
                <div className="w-10 h-10 mx-auto mb-2 bg-solvyn-100 dark:bg-slate-700 rounded-full flex items-center justify-center group-hover:bg-solvyn-200 dark:group-hover:bg-slate-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent2-600 dark:text-accent2-300"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                </div>
                <h3 className="text-sm font-medium">Solve Doubts</h3>
              </a>
              
              <a
                href="/focus"
                className="bg-solvyn-50 dark:bg-slate-800 p-4 rounded-lg text-center hover:bg-solvyn-100 dark:hover:bg-slate-700 transition-colors group"
              >
                <div className="w-10 h-10 mx-auto mb-2 bg-solvyn-100 dark:bg-slate-700 rounded-full flex items-center justify-center group-hover:bg-solvyn-200 dark:group-hover:bg-slate-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-solvyn-600 dark:text-solvyn-300"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <h3 className="text-sm font-medium">Focus Mode</h3>
              </a>
              
              <a
                href="/todo"
                className="bg-solvyn-50 dark:bg-slate-800 p-4 rounded-lg text-center hover:bg-solvyn-100 dark:hover:bg-slate-700 transition-colors group"
              >
                <div className="w-10 h-10 mx-auto mb-2 bg-solvyn-100 dark:bg-slate-700 rounded-full flex items-center justify-center group-hover:bg-solvyn-200 dark:group-hover:bg-slate-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent2-600 dark:text-accent2-300"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <h3 className="text-sm font-medium">To-Do List</h3>
              </a>
              
              <a
                href="/answer-analyzer"
                className="bg-solvyn-50 dark:bg-slate-800 p-4 rounded-lg text-center hover:bg-solvyn-100 dark:hover:bg-slate-700 transition-colors group"
              >
                <div className="w-10 h-10 mx-auto mb-2 bg-solvyn-100 dark:bg-slate-700 rounded-full flex items-center justify-center group-hover:bg-solvyn-200 dark:group-hover:bg-slate-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-solvyn-600 dark:text-solvyn-300"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>
                </div>
                <h3 className="text-sm font-medium">Answer Analysis</h3>
              </a>
              
              <a
                href="/quiz"
                className="bg-solvyn-50 dark:bg-slate-800 p-4 rounded-lg text-center hover:bg-solvyn-100 dark:hover:bg-slate-700 transition-colors group"
              >
                <div className="w-10 h-10 mx-auto mb-2 bg-solvyn-100 dark:bg-slate-700 rounded-full flex items-center justify-center group-hover:bg-solvyn-200 dark:group-hover:bg-slate-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent2-600 dark:text-accent2-300"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/><path d="M4 7v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/><path d="M13 15c0-1.105.895-2 2-2s2 .895 2 2c0 .033 0 .066-.002.098A2 2 0 0 1 15 17c-1.105 0-2-.895-2-2Z"/><path d="m13 8 1-4 2 4 2-4 .5 2 2 .5-4 2 4 2-2 .5-.5 2-2-4-2 4-1-4-4 2 4-2-4-2Z"/><path d="M5 10h14"/></svg>
                </div>
                <h3 className="text-sm font-medium">Take a Quiz</h3>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl">Focus Leaderboard</CardTitle>
          <CardDescription>
            Students ranked by total focus time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 font-medium">Rank</th>
                  <th className="py-3 px-4 font-medium">Student</th>
                  <th className="py-3 px-4 font-medium">Institution</th>
                  <th className="py-3 px-4 font-medium text-right">Focus Time</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData
                  .sort((a, b) => b.focusTime - a.focusTime)
                  .map((user, i) => {
                    const isCurrentUser = currentUser && user.id === currentUser.id;
                    return (
                      <tr 
                        key={user.id} 
                        className={`${isCurrentUser ? 'bg-solvyn-50 dark:bg-solvyn-900/20' : ''} ${
                          i % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-gray-50 dark:bg-slate-900'
                        } hover:bg-gray-100 dark:hover:bg-slate-800`}
                      >
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className={`
                            inline-flex items-center justify-center w-6 h-6 rounded-full
                            ${i === 0 ? 'bg-yellow-100 text-yellow-700' : ''}
                            ${i === 1 ? 'bg-gray-100 text-gray-700' : ''}
                            ${i === 2 ? 'bg-amber-100 text-amber-700' : ''}
                            ${i > 2 ? 'bg-transparent' : ''}
                          `}>
                            {i + 1}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {user.name}
                          {isCurrentUser && <span className="ml-2 text-xs bg-solvyn-100 dark:bg-solvyn-800 text-solvyn-600 dark:text-solvyn-300 py-0.5 px-1.5 rounded">You</span>}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.school}</td>
                        <td className="py-3 px-4 text-right font-medium">{formatFocusTime(user.focusTime)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
