
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { aiService } from '@/services/aiService';
import { boardOptions, gradeOptions, getSubjectOptions } from '@/data/formOptions';
import { ArrowUpFromLineIcon, UploadIcon } from 'lucide-react';

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
  
  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">AI Answer Sheet Analyzer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Answer Information</CardTitle>
                <CardDescription>
                  Provide details about the answer you want to analyze
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
                    <label className="text-sm font-medium">Question</label>
                    <label htmlFor="question-upload" className="cursor-pointer text-xs text-solvyn-600 hover:text-solvyn-700 dark:text-solvyn-400 flex items-center">
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
                    placeholder="Enter the question text here..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Answer to Analyze</label>
                    <label htmlFor="answer-upload" className="cursor-pointer text-xs text-solvyn-600 hover:text-solvyn-700 dark:text-solvyn-400 flex items-center">
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
                    placeholder="Enter the answer text here..."
                    rows={5}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-solvyn-600 to-accent2-600 hover:from-solvyn-700 hover:to-accent2-700"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center">
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-white"></span>
                      Analyzing...
                    </span>
                  ) : (
                    "Analyze Answer"
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
        
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                AI-powered evaluation and feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              {analysis ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap rounded-md bg-slate-50 dark:bg-slate-900 p-4">
                    {analysis}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-slate-900 rounded-lg border border-dashed p-8">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <ArrowUpFromLineIcon className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No Analysis Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Fill the form on the left and submit an answer to see the analysis here
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnswerAnalyzer;
