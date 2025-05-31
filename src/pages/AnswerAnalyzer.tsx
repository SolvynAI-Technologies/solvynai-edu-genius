
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { aiService } from '@/services/aiService';
import { boardOptions, gradeOptions, getSubjectOptions } from '@/data/formOptions';
import { UploadIcon } from 'lucide-react';

const AnswerAnalyzer = () => {
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    board: '',
    question: '',
    answer: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const subjectOptions = getSubjectOptions(formData.grade);
  
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleFileUpload = (field: 'question' | 'answer', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFormData(prev => ({ ...prev, [field]: content }));
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
        description: "Please enter the question text",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.answer.trim()) {
      toast({
        title: "Answer is required",
        description: "Please enter the answer text to analyze",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsAnalyzing(true);
      
      const result = await aiService.analyzeAnswerSheet(
        formData.grade,
        formData.subject,
        formData.board,
        formData.question,
        formData.answer
      );
      
      setAnalysis(result);
      
      toast({
        title: "Analysis complete",
        description: "Your answer has been analyzed successfully",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was a problem analyzing the answer",
        variant: "destructive",
      });
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  if (analysis) {
    return (
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Analysis Results 📊</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              AI-powered evaluation and feedback on your answer sheet
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setAnalysis(null);
              setFormData({
                grade: '',
                subject: '',
                board: '',
                question: '',
                answer: '',
              });
            }}
          >
            Analyze New Answer
          </Button>
        </div>
        
        <Card className="h-full">
          <CardContent className="p-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap rounded-md bg-slate-50 dark:bg-slate-900 p-6 border">
                {analysis}
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
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            📊 AI Answer Sheet Analyzer
          </h1>
          <p className="text-purple-100">
            Get expert analysis and feedback on your answer sheets with AI-powered evaluation
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Analysis Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Configuration</CardTitle>
              <CardDescription>
                Set up your answer sheet analysis requirements
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

          {/* Question & Answer */}
          <Card>
            <CardHeader>
              <CardTitle>Question & Answer</CardTitle>
              <CardDescription>
                Enter the question and student answer for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Question</label>
                  <label htmlFor="question-upload" className="cursor-pointer text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center">
                    <UploadIcon className="w-3 h-3 mr-1" />
                    Upload File
                    <Input
                      id="question-upload"
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload('question', e)}
                      accept=".txt,.doc,.docx,application/msword"
                    />
                  </label>
                </div>
                <Textarea
                  value={formData.question}
                  onChange={(e) => handleFormChange('question', e.target.value)}
                  placeholder="Enter the question here..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Student Answer</label>
                  <label htmlFor="answer-upload" className="cursor-pointer text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center">
                    <UploadIcon className="w-3 h-3 mr-1" />
                    Upload File
                    <Input
                      id="answer-upload"
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload('answer', e)}
                      accept=".txt,.doc,.docx,application/msword"
                    />
                  </label>
                </div>
                <Textarea
                  value={formData.answer}
                  onChange={(e) => handleFormChange('answer', e.target.value)}
                  placeholder="Enter the student's answer here..."
                  rows={6}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                disabled={isAnalyzing}
                size="lg"
              >
                {isAnalyzing ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-white"></span>
                    Analyzing Answer Sheet...
                  </span>
                ) : (
                  "Analyze Answer Sheet"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default AnswerAnalyzer;
