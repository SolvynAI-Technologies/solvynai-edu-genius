
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TodoItem } from '@/types';
import { useAuth } from './AuthContext';

interface TodoContextType {
  todos: TodoItem[];
  addTodo: (todo: Omit<TodoItem, 'id' | 'userId' | 'createdAt'>) => void;
  updateTodo: (id: string, updates: Partial<TodoItem>) => void;
  deleteTodo: (id: string) => void;
  moveTodo: (id: string, newStatus: 'todo' | 'inProgress' | 'done') => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const { currentUser } = useAuth();

  // Load todos from localStorage
  useEffect(() => {
    if (currentUser) {
      const savedTodos = localStorage.getItem(`solvyn_todos_${currentUser.id}`);
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }
    }
  }, [currentUser]);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (currentUser && todos.length > 0) {
      localStorage.setItem(`solvyn_todos_${currentUser.id}`, JSON.stringify(todos));
    }
  }, [todos, currentUser]);

  const addTodo = (todo: Omit<TodoItem, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;
    
    const newTodo: TodoItem = {
      ...todo,
      id: `todo-${Date.now()}`,
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    
    setTodos([...todos, newTodo]);
  };

  const updateTodo = (id: string, updates: Partial<TodoItem>) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const moveTodo = (id: string, newStatus: 'todo' | 'inProgress' | 'done') => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, status: newStatus } : todo
    ));
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
