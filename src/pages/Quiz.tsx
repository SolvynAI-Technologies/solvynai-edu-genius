
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { aiService } from '@/services/aiService';
import { boardOptions, gradeOptions, getSubjectOptions } from '@/data/formOptions';
import { QuizQuestion } from '@/types';

const Quiz = () => {
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    board: '',
    topics: '',
    numQuestions: 5,
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  
  const { toast } = useToast();
  
  const subjectOptions = getSubjectOptions(formData.grade);
  
  const handleFormChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleGenerateQuiz = async () => {
    if (!formData.grade || !formData.subject || !formData.board || !formData.topics.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      const generatedQuestions = await aiService.generateQuiz(
        formData.grade,
        formData.subject,
        formData.board,
        formData.topics.split(',').map(t => t.trim()),
        formData.numQuestions
      );
      
      setQuestions(generatedQuestions);
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      setQuizCompleted(false);
      
      toast({
        title: "Quiz generated",
        description: "Your quiz is ready to start",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was a problem generating your quiz",
        variant: "destructive",
      });
      console.error('Quiz generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const startQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
  };
  
  const handleSelectAnswer = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const finishQuiz = () => {
    setQuizCompleted(true);
    setEndTime(Date.now());
    setQuizStarted(false);
  };
  
  const getQuizResults = () => {
    if (questions.length === 0) return null;
    
    let correctAnswers = 0;
    
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const timeSpent = endTime && startTime ? Math.floor((endTime - startTime) / 1000) : 0;
    
    return {
      totalQuestions,
      correctAnswers,
      wrongAnswers: totalQuestions - correctAnswers,
      score,
      timeSpent
    };
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minute${mins !== 1 ? 's' : ''} ${secs} second${secs !== 1 ? 's' : ''}`;
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  const quizResults = getQuizResults();
  const isAnswered = currentQuestion && selectedAnswers[currentQuestion.id];
  
  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Quiz Generator</h1>
      
      {!questions.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate a Quiz</CardTitle>
              <CardDescription>
                Create a custom quiz based on your topics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Grade/Class</label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => handleFormChange('grade', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Board</label>
                  <Select
                    value={formData.board}
                    onValueChange={(value) => handleFormChange('board', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent>
                      {boardOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => handleFormChange('subject', value)}
                  disabled={!formData.grade}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Topics (comma-separated)</label>
                <Input
                  value={formData.topics}
                  onChange={(e) => handleFormChange('topics', e.target.value)}
                  placeholder="e.g. Quadratic Equations, Trigonometry, Calculus"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Questions</label>
                <Select
                  value={formData.numQuestions.toString()}
                  onValueChange={(value) => handleFormChange('numQuestions', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} questions
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleGenerateQuiz}
                className="w-full bg-gradient-to-r from-solvyn-600 to-accent2-600 hover:from-solvyn-700 hover:to-accent2-700"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-white"></span>
                    Generating...
                  </span>
                ) : (
                  "Generate Quiz"
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quiz Benefits</CardTitle>
              <CardDescription>
                Why quizzing is an effective learning strategy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
                <h3 className="font-medium text-solvyn-600 dark:text-solvyn-400 mb-2">Active Recall</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Quizzing forces you to retrieve information from memory, 
                  strengthening neural pathways and making recall easier in the future.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
                <h3 className="font-medium text-solvyn-600 dark:text-solvyn-400 mb-2">Identifying Knowledge Gaps</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Regular quizzing helps identify areas where you need more study, allowing you to 
                  focus your efforts efficiently.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
                <h3 className="font-medium text-solvyn-600 dark:text-solvyn-400 mb-2">Better Long-term Retention</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Research shows that testing yourself leads to better long-term retention than simply 
                  reviewing material.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
                <h3 className="font-medium text-solvyn-600 dark:text-solvyn-400 mb-2">Reduces Test Anxiety</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Regular practice with quizzes helps reduce anxiety during actual exams by making the 
                  testing format familiar.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : quizCompleted ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Results</CardTitle>
                <CardDescription>
                  Your performance summary
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {quizResults && (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <div className="relative mx-auto w-32 h-32 mb-4">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            className="stroke-none fill-gray-200 dark:fill-gray-800"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={`stroke-none ${
                              quizResults.score >= 80
                                ? 'fill-green-500'
                                : quizResults.score >= 60
                                ? 'fill-yellow-500'
                                : 'fill-red-500'
                            }`}
                            strokeLinecap="round"
                            d={`M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`}
                            strokeDasharray="100, 100"
                            strokeDashoffset={100 - quizResults.score}
                          />
                          <text x="18" y="20.35" className="fill-gray-800 dark:fill-white font-medium text-5xl" textAnchor="middle">
                            {quizResults.score}%
                          </text>
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold mb-1">
                        {quizResults.score >= 80
                          ? 'Excellent!'
                          : quizResults.score >= 60
                          ? 'Good job!'
                          : 'Keep practicing!'}
                      </h3>
                    </div>
                    
                    <div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600 dark:text-gray-400">Total Questions</span>
                        <span className="font-medium">{quizResults.totalQuestions}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600 dark:text-gray-400">Correct Answers</span>
                        <span className="font-medium text-green-600">{quizResults.correctAnswers}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600 dark:text-gray-400">Wrong Answers</span>
                        <span className="font-medium text-red-600">{quizResults.wrongAnswers}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600 dark:text-gray-400">Time Spent</span>
                        <span className="font-medium">{formatTime(quizResults.timeSpent)}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setQuestions([]);
                      setSelectedAnswers({});
                      setQuizCompleted(false);
                    }}
                  >
                    Create New Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Answers & Explanations</CardTitle>
                <CardDescription>
                  Review your answers and learn from explanations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={question.id} className="space-y-4">
                      {index > 0 && <Separator className="my-6" />}
                      <div>
                        <h3 className="font-medium">
                          Question {index + 1}: {question.question}
                        </h3>
                        <div className="ml-6 mt-3 space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className={`flex items-start space-x-2 p-2 rounded-md ${
                              option === question.correctAnswer
                                ? 'bg-green-50 dark:bg-green-900/20'
                                : selectedAnswers[question.id] === option && option !== question.correctAnswer
                                ? 'bg-red-50 dark:bg-red-900/20'
                                : ''
                            }`}>
                              <Label
                                htmlFor={`${question.id}-${optionIndex}`}
                                className={`flex-1 ${
                                  option === question.correctAnswer
                                    ? 'text-green-700 dark:text-green-400'
                                    : selectedAnswers[question.id] === option && option !== question.correctAnswer
                                    ? 'text-red-700 dark:text-red-400'
                                    : ''
                                }`}
                              >
                                {option}
                                {option === question.correctAnswer && (
                                  <span className="ml-2 text-green-600 dark:text-green-400">✓ Correct</span>
                                )}
                                {selectedAnswers[question.id] === option && option !== question.correctAnswer && (
                                  <span className="ml-2 text-red-600 dark:text-red-400">✗ Your answer</span>
                                )}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pl-4 border-l-2 border-solvyn-200 dark:border-solvyn-800">
                        <h4 className="text-sm font-medium text-solvyn-600 dark:text-solvyn-400">Explanation:</h4>
                        <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{question.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : quizStarted ? (
        <div>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
                  <CardDescription>
                    {formData.subject} quiz on {formData.topics}
                  </CardDescription>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Grade {formData.grade} • {boardOptions.find(b => b.value === formData.board)?.label}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 py-4">
              {currentQuestion && (
                <div className="space-y-6">
                  <h2 className="text-xl font-medium">{currentQuestion.question}</h2>
                  
                  <RadioGroup
                    value={selectedAnswers[currentQuestion.id] || ''}
                    onValueChange={(value) => handleSelectAnswer(currentQuestion.id, value)}
                  >
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                
                {currentQuestionIndex === questions.length - 1 ? (
                  <Button 
                    onClick={finishQuiz}
                    className="bg-gradient-to-r from-solvyn-600 to-accent2-600 hover:from-solvyn-700 hover:to-accent2-700"
                    disabled={!isAnswered}
                  >
                    Finish Quiz
                  </Button>
                ) : (
                  <Button 
                    onClick={goToNextQuestion}
                    disabled={!isAnswered}
                  >
                    Next Question
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center mt-6">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-full h-2 w-full max-w-3xl overflow-hidden">
              <div 
                className="bg-gradient-to-r from-solvyn-500 to-accent2-500 h-2 transition-all duration-300 ease-in-out"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Start Quiz</CardTitle>
              <CardDescription>
                Your quiz is ready to begin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md space-y-3">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Subject:</span>
                  <span className="ml-2 font-medium">{subjectOptions.find(s => s.value === formData.subject)?.label}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Topics:</span>
                  <span className="ml-2 font-medium">{formData.topics}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Questions:</span>
                  <span className="ml-2 font-medium">{questions.length}</span>
                </div>
              </div>
              
              <div className="text-center py-4">
                <h3 className="text-xl font-medium mb-2">Quiz Rules</h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 max-w-md mx-auto text-left">
                  <li>• Answer each question to proceed to the next one</li>
                  <li>• You can navigate back to previous questions</li>
                  <li>• After completing all questions, you'll receive your results</li>
                  <li>• Explanations for all answers will be provided at the end</li>
                </ul>
              </div>
              
              <div className="text-center pt-4">
                <Button 
                  onClick={startQuiz}
                  className="bg-gradient-to-r from-solvyn-600 to-accent2-600 hover:from-solvyn-700 hover:to-accent2-700"
                >
                  Start Quiz Now
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Good luck!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Quiz;
