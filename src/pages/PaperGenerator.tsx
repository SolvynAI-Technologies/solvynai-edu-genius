
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PdfViewer from '@/components/shared/PdfViewer';
import { aiService, generatePDF } from '@/services/aiService';
import { boardOptions, gradeOptions, getSubjectOptions, questionMarkOptions } from '@/data/formOptions';
import { QuestionPaperRequest } from '@/types';

const PaperGenerator = () => {
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    board: '',
    paperTitle: '',
    timeAllowed: '3 hours',
  });
  const [chapters, setChapters] = useState<Array<{ name: string; questions: { [key: string]: number } }>>([]);
  const [chapterInput, setChapterInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('question_paper.pdf');
  
  const { toast } = useToast();
  
  const subjectOptions = getSubjectOptions(formData.grade);
  
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const addChapter = () => {
    if (!chapterInput.trim()) {
      toast({
        title: "Chapter name is required",
        variant: "destructive",
      });
      return;
    }
    
    const newChapter = {
      name: chapterInput,
      questions: questionMarkOptions.reduce((acc, option) => {
        acc[option.value] = 0;
        return acc;
      }, {} as { [key: string]: number }),
    };
    
    setChapters([...chapters, newChapter]);
    setChapterInput('');
  };
  
  const removeChapter = (index: number) => {
    const updatedChapters = [...chapters];
    updatedChapters.splice(index, 1);
    setChapters(updatedChapters);
  };
  
  const updateQuestionCount = (chapterIndex: number, questionType: string, value: number) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].questions[questionType] = value;
    setChapters(updatedChapters);
  };
  
  const handleSubmit = async () => {
    // Validate form
    if (!formData.grade || !formData.subject || !formData.board) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (chapters.length === 0) {
      toast({
        title: "No chapters added",
        description: "Please add at least one chapter",
        variant: "destructive",
      });
      return;
    }
    
    // Check if at least one question is added
    const hasQuestions = chapters.some(chapter => {
      return Object.values(chapter.questions).some(count => count > 0);
    });
    
    if (!hasQuestions) {
      toast({
        title: "No questions added",
        description: "Please add at least one question to a chapter",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      const request: QuestionPaperRequest = {
        grade: formData.grade,
        subject: formData.subject,
        board: formData.board,
        chapters: chapters,
      };
      
      // Generate question paper content
      const paperContent = await aiService.generateQuestionPaper(request);
      
      // Generate PDF
      const generatedPdfUrl = await generatePDF(paperContent);
      
      setPdfUrl(generatedPdfUrl);
      setFileName(`${formData.subject}_grade${formData.grade}_paper.pdf`);
      
      toast({
        title: "Question paper generated",
        description: "Your question paper is ready for preview and download",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was a problem generating your question paper",
        variant: "destructive",
      });
      console.error('Error generating paper:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (pdfUrl) {
    return (
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Question Paper Generated! 📄</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Your custom question paper is ready for download and preview
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setPdfUrl(null);
              setChapters([]);
              setFormData({
                grade: '',
                subject: '',
                board: '',
                paperTitle: '',
                timeAllowed: '3 hours',
              });
            }}
          >
            Generate New Paper
          </Button>
        </div>
        <PdfViewer pdfUrl={pdfUrl} fileName={fileName} />
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-6 mx-auto max-w-4xl">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            📄 Question Paper Generator
          </h1>
          <p className="text-purple-100">
            Generate custom question papers with AI in minutes!
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Paper Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Paper Configuration</CardTitle>
            <CardDescription>
              Set up the details for your question paper.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Paper Title</label>
                <Input
                  value={formData.paperTitle}
                  onChange={(e) => handleFormChange('paperTitle', e.target.value)}
                  placeholder="e.g., Midterm Exam - Algebra I"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Allowed</label>
                <Input
                  value={formData.timeAllowed}
                  onChange={(e) => handleFormChange('timeAllowed', e.target.value)}
                  placeholder="3 hours"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Board/Curriculum</label>
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
            </div>
          </CardContent>
        </Card>

        {/* Chapters and Marks Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Chapters and Marks Distribution</CardTitle>
            <CardDescription>
              Add chapters and specify marks for each question type.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={chapterInput}
                onChange={(e) => setChapterInput(e.target.value)}
                placeholder="Add new chapter e.g., 'Algebra'"
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addChapter();
                  }
                }}
              />
              <Button onClick={addChapter} className="px-6">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Chapter
              </Button>
            </div>
            
            {chapters.length > 0 && (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[220px]">Chapter</TableHead>
                      {questionMarkOptions.map(option => (
                        <TableHead key={option.value} className="text-center">
                          {option.label}
                        </TableHead>
                      ))}
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chapters.map((chapter, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{chapter.name}</TableCell>
                        {questionMarkOptions.map(option => (
                          <TableCell key={option.value} className="p-2 text-center">
                            <Input
                              type="number"
                              min="0"
                              value={chapter.questions[option.value]}
                              onChange={(e) => updateQuestionCount(
                                index,
                                option.value,
                                parseInt(e.target.value) || 0
                              )}
                              className="w-12 h-8 text-center mx-auto"
                            />
                          </TableCell>
                        ))}
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeChapter(index)}
                          >
                            <TrashIcon className="h-4 w-4 text-gray-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            <Button
              onClick={handleSubmit}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              disabled={isGenerating}
              size="lg"
            >
              {isGenerating ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-white"></span>
                  Generating Paper...
                </span>
              ) : (
                "Generate Question Paper"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaperGenerator;
