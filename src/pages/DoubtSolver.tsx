
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
  
  if (solution) {
    return (
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Expert Solution 🎯</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Step-by-step explanation with learning insights
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setSolution(null);
              setFormData({
                grade: '',
                subject: '',
                board: '',
                question: '',
              });
            }}
          >
            Ask New Question
          </Button>
        </div>
        
        <Card className="h-full">
          <CardContent className="p-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap rounded-md bg-slate-50 dark:bg-slate-900 p-6 border">
                {solution}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-6 mx-auto max-w-4xl">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            ❓ AI Doubt Solver
          </h1>
          <p className="text-green-100">
            Get step-by-step solutions and explanations for your academic doubts
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Question Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Question Configuration</CardTitle>
              <CardDescription>
                Set up your question details for better AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Grade</label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => handleFormChange('grade', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Grade" />
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
                      <SelectValue placeholder="Select Subject" />
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
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Board of Education</label>
                <Select
                  value={formData.board}
                  onValueChange={(value) => handleFormChange('board', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Board" />
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
            </CardContent>
          </Card>

          {/* Enter Your Question */}
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Question</CardTitle>
              <CardDescription>
                Type your question or doubt clearly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Your Question</label>
                  <label htmlFor="question-upload" className="cursor-pointer text-xs text-green-600 hover:text-green-700 dark:text-green-400 flex items-center">
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
                  placeholder="Enter your question or doubt here. Be as specific as possible for better help..."
                  rows={8}
                  className="min-h-[200px]"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                disabled={isSolving}
                size="lg"
              >
                {isSolving ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-white"></span>
                    Solving Your Doubt...
                  </span>
                ) : (
                  "Solve My Doubt"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
      
      {/* Common Doubts */}
      <Card className="mt-8">
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
                  <p className="text-xs text-green-600">{item.subject}</p>
                  <p className="font-medium mt-1 text-sm">{item.question}</p>
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
