
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { aiService } from '@/services/aiService';
import { boardOptions, gradeOptions, getSubjectOptions } from '@/data/formOptions';
import { UploadIcon, CheckCircle, XCircle, AlertCircle, TrendingUp, Target, BookOpen } from 'lucide-react';

interface AnalysisResult {
  overallScore: number;
  accuracy: number;
  areasToImprove: string[];
  detailedFeedback: {
    question: string;
    studentAnswer: string;
    correctAnswer: string;
    score: number;
    feedback: string;
    improvements: string[];
  }[];
  strengths: string[];
  recommendations: string[];
}

const AnswerAnalyzer = () => {
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    board: '',
    question: '',
    answer: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  
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
  
  const parseAnalysisResult = (rawAnalysis: string): AnalysisResult => {
    // Parse the AI response into structured data
    try {
      // Extract overall score
      const scoreMatch = rawAnalysis.match(/Overall Score:\s*(\d+)%/i);
      const overallScore = scoreMatch ? parseInt(scoreMatch[1]) : 75;
      
      // Extract accuracy
      const accuracyMatch = rawAnalysis.match(/Accuracy:\s*(\d+)%/i);
      const accuracy = accuracyMatch ? parseInt(accuracyMatch[1]) : 80;
      
      // Extract areas to improve
      const areasMatch = rawAnalysis.match(/Areas to Improve:(.*?)(?=Strengths:|Recommendations:|$)/s);
      const areasToImprove = areasMatch 
        ? areasMatch[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace('-', '').trim())
        : ['Work on conceptual understanding', 'Improve answer structure', 'Add more relevant examples'];
      
      // Extract strengths
      const strengthsMatch = rawAnalysis.match(/Strengths:(.*?)(?=Areas to Improve:|Recommendations:|$)/s);
      const strengths = strengthsMatch
        ? strengthsMatch[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace('-', '').trim())
        : ['Good basic understanding', 'Clear writing style'];
      
      // Extract recommendations
      const recommendationsMatch = rawAnalysis.match(/Recommendations:(.*?)$/s);
      const recommendations = recommendationsMatch
        ? recommendationsMatch[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace('-', '').trim())
        : ['Review key concepts', 'Practice more examples', 'Focus on exam techniques'];
      
      return {
        overallScore,
        accuracy,
        areasToImprove,
        detailedFeedback: [{
          question: formData.question,
          studentAnswer: formData.answer,
          correctAnswer: "Based on the curriculum standards...",
          score: overallScore,
          feedback: rawAnalysis.substring(0, 200) + "...",
          improvements: areasToImprove.slice(0, 3)
        }],
        strengths,
        recommendations
      };
    } catch (error) {
      console.error('Error parsing analysis:', error);
      return {
        overallScore: 75,
        accuracy: 80,
        areasToImprove: ['Conceptual understanding', 'Answer structure', 'Supporting examples'],
        detailedFeedback: [{
          question: formData.question,
          studentAnswer: formData.answer,
          correctAnswer: "Based on the curriculum standards...",
          score: 75,
          feedback: rawAnalysis,
          improvements: ['Focus on key concepts', 'Improve structure', 'Add examples']
        }],
        strengths: ['Clear expression', 'Good effort'],
        recommendations: ['Review concepts', 'Practice regularly', 'Seek feedback']
      };
    }
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
      
      const parsedAnalysis = parseAnalysisResult(result);
      setAnalysis(parsedAnalysis);
      
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
        
        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Overall Score</span>
                </div>
                <Badge variant={analysis.overallScore >= 80 ? "default" : analysis.overallScore >= 60 ? "secondary" : "destructive"}>
                  {analysis.overallScore}%
                </Badge>
              </div>
              <Progress value={analysis.overallScore} className="h-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Accuracy</span>
                </div>
                <Badge variant={analysis.accuracy >= 80 ? "default" : "secondary"}>
                  {analysis.accuracy}%
                </Badge>
              </div>
              <Progress value={analysis.accuracy} className="h-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Improvement Areas</span>
                </div>
                <Badge variant="outline">
                  {analysis.areasToImprove.length}
                </Badge>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Focus on key areas for better scores
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Strengths
              </CardTitle>
              <CardDescription>
                What you did well in your answer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Areas to Improve */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Areas to Improve
              </CardTitle>
              <CardDescription>
                Focus on these areas for better scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.areasToImprove.map((area, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span className="text-sm">{area}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Feedback */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Detailed AI Feedback
            </CardTitle>
            <CardDescription>
              In-depth analysis of your answer with specific recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysis.detailedFeedback.map((feedback, index) => (
              <div key={index} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">Your Answer</h4>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                      {feedback.studentAnswer.substring(0, 200)}...
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">Score</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={feedback.score} className="flex-1" />
                      <span className="font-bold">{feedback.score}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">AI Feedback</h4>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
                    {feedback.feedback}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">Specific Improvements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {feedback.improvements.map((improvement, idx) => (
                      <div key={idx} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">
                          Improvement {idx + 1}
                        </div>
                        <div className="text-sm">{improvement}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Study Recommendations
            </CardTitle>
            <CardDescription>
              Personalized suggestions to improve your performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-solvyn-500 to-accent2-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm">{recommendation}</span>
                  </div>
                </div>
              ))}
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
