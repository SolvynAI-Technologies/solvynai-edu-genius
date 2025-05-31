
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TodoItem } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TodoContextType {
  todos: TodoItem[];
  addTodo: (todo: Omit<TodoItem, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateTodo: (id: string, updates: Partial<TodoItem>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  moveTodo: (id: string, newStatus: 'todo' | 'inProgress' | 'done') => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const { currentUser } = useAuth();

  // Load todos from Supabase
  useEffect(() => {
    if (currentUser) {
      fetchTodos();
    } else {
      setTodos([]);
    }
  }, [currentUser]);

  const fetchTodos = async () => {
    if (!currentUser) return;
    
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching todos:', error);
      return;
    }
    
    const formattedTodos = data?.map(todo => ({
      id: todo.id,
      userId: todo.user_id,
      title: todo.title,
      description: todo.description || '',
      status: todo.status as 'todo' | 'inProgress' | 'done',
      priority: todo.priority as 'low' | 'medium' | 'high',
      dueDate: todo.due_date,
      completed: todo.completed,
      createdAt: todo.created_at,
    })) || [];
    
    setTodos(formattedTodos);
  };

  const addTodo = async (todo: Omit<TodoItem, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;
    
    const { data, error } = await supabase
      .from('todos')
      .insert({
        user_id: currentUser.id,
        title: todo.title,
        description: todo.description,
        status: todo.status,
        priority: todo.priority,
        due_date: todo.dueDate,
        completed: todo.completed,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding todo:', error);
      return;
    }
    
    const newTodo: TodoItem = {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description || '',
      status: data.status as 'todo' | 'inProgress' | 'done',
      priority: data.priority as 'low' | 'medium' | 'high',
      dueDate: data.due_date,
      completed: data.completed,
      createdAt: data.created_at,
    };
    
    setTodos([newTodo, ...todos]);
  };

  const updateTodo = async (id: string, updates: Partial<TodoItem>) => {
    const { error } = await supabase
      .from('todos')
      .update({
        title: updates.title,
        description: updates.description,
        status: updates.status,
        priority: updates.priority,
        due_date: updates.dueDate,
        completed: updates.completed,
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating todo:', error);
      return;
    }
    
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting todo:', error);
      return;
    }
    
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const moveTodo = async (id: string, newStatus: 'todo' | 'inProgress' | 'done') => {
    await updateTodo(id, { status: newStatus });
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, updateTodo, deleteTodo, moveTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};
