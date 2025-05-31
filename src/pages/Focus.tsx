
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useFocus } from '@/contexts/FocusContext';
import { useTodo } from '@/contexts/TodoContext';

const Focus = () => {
  const { 
    startSession, 
    completeSession, 
    cancelSession, 
    remainingTime, 
    isActive, 
    isPaused,
    pauseSession,
    resumeSession,
    sessions
  } = useFocus();
  
  const { todos } = useTodo();
  
  const [duration, setDuration] = useState<number>(25);
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [treeProgress, setTreeProgress] = useState<number>(0);
  
  useEffect(() => {
    if (isActive && !isPaused) {
      const totalSeconds = duration * 60;
      const elapsed = totalSeconds - remainingTime;
      const progressPercentage = (elapsed / totalSeconds) * 100;
      setTreeProgress(progressPercentage);
    }
  }, [remainingTime, duration, isActive, isPaused]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleStartSession = () => {
    startSession(
      duration,
      selectedTaskId ? todos.find(t => t.id === selectedTaskId)?.title : taskDescription,
      selectedTaskId || undefined
    );
  };
  
  const incompleteTodos = todos.filter(todo => !todo.completed);
  
  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Focus Mode</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <div 
              className={`relative h-64 bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 flex items-center justify-center ${
                isActive ? 'animate-pulse' : ''
              }`}
            >
              {isActive ? (
                <div className="relative h-full w-full flex flex-col items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="h-48 w-48 text-green-800 dark:text-green-500" viewBox="0 0 24 24" fill="none">
                      {/* Tree trunk */}
                      <path 
                        d="M12 22V16" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                      />
                      {/* Tree branches - they appear as the timer progresses */}
                      <path 
                        d="M12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                        style={{ opacity: treeProgress >= 30 ? 1 : 0 }}
                        className="transition-opacity duration-1000"
                      />
                      <path 
                        d="M17 7C18.6569 7 20 5.65685 20 4C20 2.34315 18.6569 1 17 1C15.3431 1 14 2.34315 14 4C14 5.65685 15.3431 7 17 7Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                        style={{ opacity: treeProgress >= 60 ? 1 : 0 }}
                        className="transition-opacity duration-1000"
                      />
                      <path 
                        d="M7 7C8.65685 7 10 5.65685 10 4C10 2.34315 8.65685 1 7 1C5.34315 1 4 2.34315 4 4C4 5.65685 5.34315 7 7 7Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                        style={{ opacity: treeProgress >= 60 ? 1 : 0 }}
                        className="transition-opacity duration-1000"
                      />
                      {/* Top part */}
                      <path 
                        d="M12 1C13.6569 1 15 2.34315 15 4C15 5.65685 13.6569 7 12 7C10.3431 7 9 5.65685 9 4C9 2.34315 10.3431 1 12 1Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                        style={{ opacity: treeProgress >= 90 ? 1 : 0 }}
                        className="transition-opacity duration-1000"
                      />
                    </svg>
                  </div>
                  <div className="z-10 bg-white/90 dark:bg-black/70 py-3 px-6 rounded-lg shadow-lg">
                    <h2 className="text-4xl font-bold tracking-wider text-center">
                      {formatTime(remainingTime)}
                    </h2>
                    <p className="text-center text-sm mt-2">
                      {isPaused ? 'Paused' : 'Focus on the task'}
                    </p>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 px-4">
                    <Progress value={treeProgress} className="h-2" />
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <svg className="h-24 w-24 mx-auto text-green-800/40 dark:text-green-500/40" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M17 7C18.6569 7 20 5.65685 20 4C20 2.34315 18.6569 1 17 1C15.3431 1 14 2.34315 14 4C14 5.65685 15.3431 7 17 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M7 7C8.65685 7 10 5.65685 10 4C10 2.34315 8.65685 1 7 1C5.34315 1 4 2.34315 4 4C4 5.65685 5.34315 7 7 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 1C13.6569 1 15 2.34315 15 4C15 5.65685 13.6569 7 12 7C10.3431 7 9 5.65685 9 4C9 2.34315 10.3431 1 12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <h2 className="text-2xl font-bold mt-4">Focus to grow your tree</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Start a session to begin</p>
                </div>
              )}
            </div>
            
            <CardContent className="p-6">
              {isActive ? (
                <div className="space-y-6">
                  {selectedTaskId || taskDescription ? (
                    <div>
                      <h3 className="font-medium">Currently Working On:</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        {selectedTaskId 
                          ? todos.find(t => t.id === selectedTaskId)?.title
                          : taskDescription}
                      </p>
                    </div>
                  ) : null}
                  
                  <div className="flex space-x-4 justify-center">
                    {isPaused ? (
                      <Button 
                        className="w-32"
                        onClick={resumeSession}
                      >
                        Resume
                      </Button>
                    ) : (
                      <Button 
                        variant="outline"
                        className="w-32"
                        onClick={pauseSession}
                      >
                        Pause
                      </Button>
                    )}
                    <Button 
                      variant="destructive"
                      className="w-32"
                      onClick={cancelSession}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-medium">Session Duration</label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[duration]}
                        min={5}
                        max={60}
                        step={5}
                        onValueChange={(values) => setDuration(values[0])}
                        className="flex-1"
                      />
                      <span className="text-lg font-medium w-16 text-center">
                        {duration} min
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-medium">What are you working on?</label>
                    <div className="space-y-4">
                      {incompleteTodos.length > 0 && (
                        <Select
                          value={selectedTaskId}
                          onValueChange={(value) => {
                            setSelectedTaskId(value);
                            if (value) {
                              setTaskDescription('');
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select from your tasks (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {incompleteTodos.map(todo => (
                              <SelectItem key={todo.id} value={todo.id}>
                                {todo.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      
                      {!selectedTaskId && (
                        <Input
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                          placeholder="Or describe what you're focusing on (optional)"
                        />
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-solvyn-600 to-accent2-600 hover:from-solvyn-700 hover:to-accent2-700"
                    onClick={handleStartSession}
                  >
                    Start Focus Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Focus History</CardTitle>
              <CardDescription>Your recent focus sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-1">No sessions yet</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Start your first focus session
                  </p>
                </div>
              ) : (
                <>
                  {sessions.slice(0, 7).map((session, index) => (
                    <div key={session.id}>
                      {index > 0 && <Separator className="my-2" />}
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">
                            {session.taskDescription || 'Focus Session'}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(session.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{session.duration} min</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {session.completed ? 'Completed' : 'Cancelled'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {sessions.length > 7 && (
                    <div className="text-center mt-4">
                      <Button variant="link" size="sm">
                        View All Sessions
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Focus;
