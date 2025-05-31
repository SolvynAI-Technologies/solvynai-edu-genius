
import { BoardOption, GradeOption, SubjectOption } from '@/types';

export const boardOptions: BoardOption[] = [
  { value: 'cbse', label: 'CBSE' },
  { value: 'icse', label: 'ICSE' },
  { value: 'igcse', label: 'Cambridge IGCSE' },
  { value: 'ib', label: 'International Baccalaureate' },
  { value: 'state', label: 'State Board' },
];

export const gradeOptions: GradeOption[] = [
  { value: '1', label: 'Grade 1' },
  { value: '2', label: 'Grade 2' },
  { value: '3', label: 'Grade 3' },
  { value: '4', label: 'Grade 4' },
  { value: '5', label: 'Grade 5' },
  { value: '6', label: 'Grade 6' },
  { value: '7', label: 'Grade 7' },
  { value: '8', label: 'Grade 8' },
  { value: '9', label: 'Grade 9' },
  { value: '10', label: 'Grade 10' },
  { value: '11', label: 'Grade 11' },
  { value: '12', label: 'Grade 12' },
];

export const subjectOptions: {[key: string]: SubjectOption[]} = {
  default: [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'english', label: 'English' },
    { value: 'social_studies', label: 'Social Studies' },
  ],
  high_school: [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' },
    { value: 'geography', label: 'Geography' },
    { value: 'computer_science', label: 'Computer Science' },
    { value: 'economics', label: 'Economics' },
  ],
};

export const getSubjectOptions = (grade: string): SubjectOption[] => {
  const gradeNum = parseInt(grade);
  if (gradeNum >= 9) {
    return subjectOptions.high_school;
  }
  return subjectOptions.default;
};

export const questionMarkOptions = [
  { value: '1m', label: '1 Mark (MCQ)' },
  { value: '2m', label: '2 Marks' },
  { value: '3m', label: '3 Marks' },
  { value: '4m', label: '4 Marks' },
  { value: '5m', label: '5 Marks' },
  { value: '6m', label: '6 Marks' },
];
