
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTodo } from '@/contexts/TodoContext';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckCircleIcon, CircleIcon, PencilIcon, PlusIcon, TrashIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const Todo = () => {
  const { todos, addTodo, updateTodo, deleteTodo, moveTodo } = useTodo();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    status: 'todo' as 'todo' | 'inProgress' | 'done',
  });
  const [activeTab, setActiveTab] = useState('all');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const todoItems = todos.filter(todo => todo.status === 'todo');
  const inProgressItems = todos.filter(todo => todo.status === 'inProgress');
  const doneItems = todos.filter(todo => todo.status === 'done');
  
  const filteredTodos = activeTab === 'all' 
    ? todos 
    : todos.filter(todo => {
        if (activeTab === 'todo') return todo.status === 'todo';
        if (activeTab === 'inProgress') return todo.status === 'inProgress';
        if (activeTab === 'done') return todo.status === 'done';
        return true;
      });

  const resetNewTodo = () => {
    setNewTodo({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      status: 'todo',
    });
    setDate(undefined);
  };

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) return;
    
    addTodo({
      ...newTodo,
      completed: false,
    });
    
    resetNewTodo();
    setShowAddDialog(false);
  };

  const handleUpdateTodo = () => {
    if (!editingTodo || !newTodo.title.trim()) return;
    
    updateTodo(editingTodo, {
      ...newTodo,
    });
    
    resetNewTodo();
    setEditingTodo(null);
  };

  const startEditTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      setNewTodo({
        title: todo.title,
        description: todo.description || '',
        priority: todo.priority,
        dueDate: todo.dueDate || '',
        status: todo.status,
      });
      
      if (todo.dueDate) {
        setDate(new Date(todo.dueDate));
      } else {
        setDate(undefined);
      }
      
      setEditingTodo(id);
    }
  };
  
  const handleToggleComplete = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      updateTodo(id, { completed: !todo.completed });
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">To-Do List</h1>
        <Button 
          onClick={() => {
            resetNewTodo();
            setShowAddDialog(true);
          }}
          className="bg-gradient-to-r from-solvyn-600 to-accent2-600 hover:from-solvyn-700 hover:to-accent2-700"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">View</label>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-2">
                    <TabsTrigger value="all">All Tasks</TabsTrigger>
                    <TabsTrigger value="todo">To Do</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="inProgress">In Progress</TabsTrigger>
                    <TabsTrigger value="done">Done</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Stats</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-md bg-slate-100 dark:bg-slate-800 px-3 py-2 text-center">
                      <div className="text-2xl font-bold">{todoItems.length}</div>
                      <div className="text-xs text-gray-500">To Do</div>
                    </div>
                    <div className="rounded-md bg-slate-100 dark:bg-slate-800 px-3 py-2 text-center">
                      <div className="text-2xl font-bold">{inProgressItems.length}</div>
                      <div className="text-xs text-gray-500">In Progress</div>
                    </div>
                    <div className="rounded-md bg-slate-100 dark:bg-slate-800 px-3 py-2 text-center">
                      <div className="text-2xl font-bold">{doneItems.length}</div>
                      <div className="text-xs text-gray-500">Done</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Task Completion</div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-solvyn-500 to-accent2-500 transition-all duration-300 ease-in-out"
                      style={{ 
                        width: `${todos.length > 0 ? (doneItems.length / todos.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    {todos.length > 0 
                      ? `${Math.round((doneItems.length / todos.length) * 100)}% complete` 
                      : 'No tasks yet'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle>Task List</CardTitle>
                  <CardDescription>
                    {activeTab === 'all' 
                      ? 'All tasks' 
                      : activeTab === 'todo' 
                        ? 'Tasks to do'
                        : activeTab === 'inProgress'
                          ? 'Tasks in progress'
                          : 'Completed tasks'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredTodos.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <ClockIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">No tasks found</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {activeTab === 'all' 
                          ? 'Add a new task to get started' 
                          : 'No tasks in this category'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTodos.map(todo => (
                        <div 
                          key={todo.id}
                          className={`p-4 border rounded-lg ${todo.completed ? 'bg-gray-50 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-950'}`}
                        >
                          <div className="flex items-start gap-3">
                            <button 
                              className="mt-1 text-gray-400 hover:text-solvyn-500 transition-colors"
                              onClick={() => handleToggleComplete(todo.id)}
                            >
                              {todo.completed ? (
                                <CheckCircleIcon className="h-5 w-5 text-solvyn-500" />
                              ) : (
                                <CircleIcon className="h-5 w-5" />
                              )}
                            </button>
                            
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                                  {todo.title}
                                </h3>
                                <div className="flex space-x-1">
                                  <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(todo.priority)}`}>
                                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    todo.status === 'done'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                      : todo.status === 'inProgress'
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                                  }`}>
                                    {todo.status === 'todo' 
                                      ? 'To Do' 
                                      : todo.status === 'inProgress' 
                                        ? 'In Progress' 
                                        : 'Done'}
                                  </span>
                                </div>
                              </div>
                              
                              {todo.description && (
                                <p className={`text-sm mt-1 ${todo.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                                  {todo.description}
                                </p>
                              )}
                              
                              <div className="mt-2 flex justify-between items-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                  {todo.dueDate && (
                                    <>
                                      <CalendarIcon className="h-3 w-3 mr-1" />
                                      {format(new Date(todo.dueDate), 'PPP')}
                                    </>
                                  )}
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm" onClick={() => startEditTodo(todo.id)}>
                                    <PencilIcon className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => deleteTodo(todo.id)}>
                                    <TrashIcon className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="kanban">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="bg-gray-50 dark:bg-slate-900 pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">To Do</CardTitle>
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 text-xs font-medium">
                        {todoItems.length}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 space-y-2">
                    {todoItems.length === 0 ? (
                      <div className="text-center py-6 px-2 border border-dashed rounded">
                        <p className="text-sm text-gray-500">No tasks to do</p>
                      </div>
                    ) : (
                      todoItems.map(todo => (
                        <div 
                          key={todo.id} 
                          className="p-3 bg-white dark:bg-slate-950 rounded border shadow-sm cursor-move"
                          draggable
                          onDragEnd={() => moveTodo(todo.id, 'inProgress')}
                        >
                          <div className="flex justify-between">
                            <h4 className="font-medium text-sm">{todo.title}</h4>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${getPriorityColor(todo.priority)}`}>
                              {todo.priority.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {todo.description && (
                            <p className="text-xs mt-1 text-gray-600 dark:text-gray-300 line-clamp-2">
                              {todo.description}
                            </p>
                          )}
                          {todo.dueDate && (
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {format(new Date(todo.dueDate), 'PPP')}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="bg-blue-50 dark:bg-blue-900/20 pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">In Progress</CardTitle>
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800/40 text-xs font-medium">
                        {inProgressItems.length}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 space-y-2">
                    {inProgressItems.length === 0 ? (
                      <div className="text-center py-6 px-2 border border-dashed rounded">
                        <p className="text-sm text-gray-500">No tasks in progress</p>
                      </div>
                    ) : (
                      inProgressItems.map(todo => (
                        <div 
                          key={todo.id} 
                          className="p-3 bg-white dark:bg-slate-950 rounded border shadow-sm cursor-move"
                          draggable
                          onDragEnd={() => moveTodo(todo.id, 'done')}
                        >
                          <div className="flex justify-between">
                            <h4 className="font-medium text-sm">{todo.title}</h4>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${getPriorityColor(todo.priority)}`}>
                              {todo.priority.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {todo.description && (
                            <p className="text-xs mt-1 text-gray-600 dark:text-gray-300 line-clamp-2">
                              {todo.description}
                            </p>
                          )}
                          {todo.dueDate && (
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {format(new Date(todo.dueDate), 'PPP')}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="bg-green-50 dark:bg-green-900/20 pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Done</CardTitle>
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-800/40 text-xs font-medium">
                        {doneItems.length}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 space-y-2">
                    {doneItems.length === 0 ? (
                      <div className="text-center py-6 px-2 border border-dashed rounded">
                        <p className="text-sm text-gray-500">No completed tasks</p>
                      </div>
                    ) : (
                      doneItems.map(todo => (
                        <div 
                          key={todo.id} 
                          className="p-3 bg-white dark:bg-slate-950 rounded border shadow-sm"
                        >
                          <div className="flex justify-between">
                            <h4 className="font-medium text-sm">{todo.title}</h4>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${getPriorityColor(todo.priority)}`}>
                              {todo.priority.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {todo.description && (
                            <p className="text-xs mt-1 text-gray-600 dark:text-gray-300 line-clamp-2">
                              {todo.description}
                            </p>
                          )}
                          {todo.dueDate && (
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {format(new Date(todo.dueDate), 'PPP')}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog || editingTodo !== null} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setEditingTodo(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTodo ? 'Edit Task' : 'Add New Task'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newTodo.title}
                onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                placeholder="Task title"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                value={newTodo.description}
                onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                placeholder="Task description"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={newTodo.priority}
                  onValueChange={(value) => setNewTodo({
                    ...newTodo,
                    priority: value as 'low' | 'medium' | 'high'
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={newTodo.status}
                  onValueChange={(value) => setNewTodo({
                    ...newTodo,
                    status: value as 'todo' | 'inProgress' | 'done'
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date (Optional)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      if (newDate) {
                        setNewTodo({...newTodo, dueDate: newDate.toISOString()});
                      } else {
                        setNewTodo({...newTodo, dueDate: ''});
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowAddDialog(false);
                setEditingTodo(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={editingTodo ? handleUpdateTodo : handleAddTodo}
              disabled={!newTodo.title.trim()}
              className="bg-gradient-to-r from-solvyn-600 to-accent2-600 hover:from-solvyn-700 hover:to-accent2-700"
            >
              {editingTodo ? 'Update Task' : 'Add Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Todo;
