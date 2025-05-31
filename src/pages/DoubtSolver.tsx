
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { aiService } from '@/services/aiService';
import { boardOptions, gradeOptions, getSubjectOptions } from '@/data/formOptions';
import { UploadIcon } from 'lucide-react';

const DoubtSolver = () => {
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    board: '',
    question: '',
  });
  const [isSolving, setIsSolving] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const subjectOptions = getSubjectOptions(formData.grade);
  
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFormData(prev => ({ ...prev, question: content }));
    };
    reader.readAsText(file);
    
    // Reset file input
    e.target.value = '';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.grade || !formData.subject || !formData.board) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.question.trim()) {
      toast({
        title: "Question is required",
        description: "Please enter your doubt or question",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSolving(true);
      
      const result = await aiService.solveDoubt(
        formData.grade,
        formData.subject,
        formData.board,
        formData.question
      );
      
      setSolution(result);
      
      toast({
        title: "Solution ready",
        description: "Your doubt has been resolved",
      });
    } catch (error) {
      toast({
        title: "Solving failed",
        description: "There was a problem solving your doubt",
        variant: "destructive",
      });
      console.error('Solving error:', error);
    } finally {
      setIsSolving(false);
    }
  };
  
  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">AI Doubt Solver</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Your Doubt</CardTitle>
                <CardDescription>
                  Ask any academic question and get expert solutions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Your Question</label>
                    <label htmlFor="question-upload" className="cursor-pointer text-xs text-solvyn-600 hover:text-solvyn-700 dark:text-solvyn-400 flex items-center">
                      <UploadIcon className="w-3 h-3 mr-1" />
                      Upload File
                      <Input
                        id="question-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                        accept=".txt,.doc,.docx,application/msword,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                  <Textarea
                    value={formData.question}
                    onChange={(e) => handleFormChange('question', e.target.value)}
                    placeholder="Type your doubt or question here..."
                    rows={8}
                    className="min-h-[200px]"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-solvyn-600 to-accent2-600 hover:from-solvyn-700 hover:to-accent2-700"
                  disabled={isSolving}
                >
                  {isSolving ? (
                    <span className="flex items-center">
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-white"></span>
                      Solving...
                    </span>
                  ) : (
                    "Solve My Doubt"
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
        
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Expert Solution</CardTitle>
              <CardDescription>
                Step-by-step explanation with learning insights
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              {solution ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap rounded-md bg-slate-50 dark:bg-slate-900 p-4">
                    {solution}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-slate-900 rounded-lg border border-dashed p-8">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                    </div>
                    <h3 className="text-lg font-medium mb-1">No Solution Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Ask a question to receive a step-by-step solution
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Common Doubts</CardTitle>
          <CardDescription>
            Frequently asked questions across subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                subject: "Mathematics",
                question: "How to solve quadratic equations?",
              },
              {
                subject: "Physics",
                question: "Explain Newton's laws of motion with examples",
              },
              {
                subject: "Chemistry",
                question: "How does periodic table organization work?",
              },
              {
                subject: "Biology",
                question: "Explain photosynthesis process in plants",
              },
              {
                subject: "English",
                question: "How to write a persuasive essay?",
              },
              {
                subject: "Computer Science",
                question: "What is the difference between array and linked list?",
              },
            ].map((item, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  question: item.question,
                  subject: subjectOptions.find(opt => opt.label.toLowerCase().includes(item.subject.toLowerCase()))?.value || prev.subject
                }));
              }}>
                <div className="p-4">
                  <p className="text-xs text-solvyn-600">{item.subject}</p>
                  <p className="font-medium mt-1">{item.question}</p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoubtSolver;
