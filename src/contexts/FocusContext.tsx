
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FocusSession } from '@/types';
import { useAuth } from './AuthContext';
import { useTodo } from './TodoContext';
import { supabase } from '@/integrations/supabase/client';

interface FocusContextType {
  sessions: FocusSession[];
  activeSession: FocusSession | null;
  startSession: (duration: number, taskDescription?: string, taskId?: string) => void;
  completeSession: () => void;
  cancelSession: () => void;
  remainingTime: number;
  isActive: boolean;
  isPaused: boolean;
  pauseSession: () => void;
  resumeSession: () => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  
  const { currentUser } = useAuth();
  const { updateTodo } = useTodo();
  
  // Load sessions from Supabase
  useEffect(() => {
    if (currentUser) {
      fetchSessions();
    } else {
      setSessions([]);
    }
  }, [currentUser]);
  
  const fetchSessions = async () => {
    if (!currentUser) return;
    
    const { data, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching sessions:', error);
      return;
    }
    
    const formattedSessions = data?.map(session => ({
      id: session.id,
      userId: session.user_id,
      duration: session.duration,
      completed: session.completed,
      taskDescription: session.task_description,
      taskId: session.task_id,
      date: session.date,
    })) || [];
    
    setSessions(formattedSessions);
  };
  
  // Timer countdown
  useEffect(() => {
    if (!isActive || isPaused || !activeSession) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          completeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setIntervalId(timer as unknown as number);
    
    return () => {
      clearInterval(timer);
    };
  }, [isActive, isPaused, activeSession]);
  
  const startSession = (duration: number, taskDescription?: string, taskId?: string) => {
    if (isActive || !currentUser) return;
    
    const newSession: FocusSession = {
      id: `focus-${Date.now()}`,
      userId: currentUser.id,
      duration,
      completed: false,
      taskDescription,
      taskId,
      date: new Date().toISOString(),
    };
    
    setActiveSession(newSession);
    setRemainingTime(duration * 60); // Convert minutes to seconds
    setIsActive(true);
    setIsPaused(false);
  };
  
  const completeSession = async () => {
    if (!activeSession || !currentUser) return;
    
    clearInterval(intervalId!);
    
    // Mark session as completed
    const completedSession = {
      ...activeSession,
      completed: true,
    };
    
    // Save to Supabase
    const { error } = await supabase
      .from('focus_sessions')
      .insert({
        user_id: currentUser.id,
        duration: completedSession.duration,
        completed: true,
        task_description: completedSession.taskDescription,
        task_id: completedSession.taskId,
        date: completedSession.date,
      });
    
    if (error) {
      console.error('Error saving focus session:', error);
    } else {
      // Add to sessions history
      setSessions(prev => [completedSession, ...prev]);
      
      // If linked to a todo item, mark it as completed
      if (completedSession.taskId) {
        updateTodo(completedSession.taskId, { completed: true });
      }
    }
    
    // Reset active session
    setActiveSession(null);
    setIsActive(false);
    setIsPaused(false);
    setRemainingTime(0);
  };
  
  const cancelSession = () => {
    if (!isActive) return;
    
    clearInterval(intervalId!);
    setActiveSession(null);
    setIsActive(false);
    setIsPaused(false);
    setRemainingTime(0);
  };
  
  const pauseSession = () => {
    if (!isActive || isPaused) return;
    
    clearInterval(intervalId!);
    setIsPaused(true);
  };
  
  const resumeSession = () => {
    if (!isActive || !isPaused) return;
    
    setIsPaused(false);
  };
  
  return (
    <FocusContext.Provider
      value={{
        sessions,
        activeSession,
        startSession,
        completeSession,
        cancelSession,
        remainingTime,
        isActive,
        isPaused,
        pauseSession,
        resumeSession,
      }}
    >
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (context === undefined) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
};
