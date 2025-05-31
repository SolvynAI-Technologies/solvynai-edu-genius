
export interface User {
  id: string;
  email: string;
  fullName: string;
  schoolName: string;
  gender: 'male' | 'female' | 'other';
  focusTime: number; // Total focus time in minutes
  avatar?: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  duration: number; // in minutes
  completed: boolean;
  taskDescription?: string;
  taskId?: string; // If linked to a todo item
  date: string;
}

export interface TodoItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'todo' | 'inProgress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

export interface QuestionPaperRequest {
  grade: string;
  subject: string;
  board: string;
  chapters: {
    name: string;
    questions: {
      [key: string]: number; // e.g., "1m": 5, "2m": 3
    };
  }[];
}

export interface BoardOption {
  value: string;
  label: string;
}

export interface SubjectOption {
  value: string;
  label: string;
}

export interface GradeOption {
  value: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  timeSpent: number; // in seconds
}
