
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
  
  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">AI Question Paper Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Paper Information</CardTitle>
              <CardDescription>
                Provide details about the question paper you want to generate
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
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Add Chapters</label>
                  <div className="flex space-x-2">
                    <Input
                      value={chapterInput}
                      onChange={(e) => setChapterInput(e.target.value)}
                      placeholder="e.g. Algebra, Trigonometry"
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addChapter();
                        }
                      }}
                    />
                    <Button onClick={addChapter} size="icon">
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
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
                  className="w-full mt-4 bg-gradient-to-r from-solvyn-600 to-accent2-600 hover:from-solvyn-700 hover:to-accent2-700"
                  disabled={isGenerating}
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
              </div>
            </CardContent>
          </Card>
          
          {chapters.length > 0 && (
            <div className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Paper Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium">Total Chapters:</dt>
                      <dd>{chapters.length}</dd>
                    </div>
                    
                    {questionMarkOptions.map(option => {
                      const total = chapters.reduce(
                        (sum, chapter) => sum + (chapter.questions[option.value] || 0),
                        0
                      );
                      return (
                        <div key={option.value} className="flex justify-between">
                          <dt>{option.label} Questions:</dt>
                          <dd>{total}</dd>
                        </div>
                      );
                    })}
                    
                    <div className="flex justify-between pt-2 border-t">
                      <dt className="font-medium">Total Marks:</dt>
                      <dd className="font-medium">
                        {chapters.reduce((sum, chapter) => {
                          return sum + Object.entries(chapter.questions).reduce(
                            (chapterSum, [type, count]) => {
                              return chapterSum + (parseInt(type) * count);
                            },
                            0
                          );
                        }, 0)}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        <div>
          {pdfUrl ? (
            <PdfViewer pdfUrl={pdfUrl} fileName={fileName} />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-slate-900 rounded-lg border border-dashed p-8">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-1">No PDF Generated Yet</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Fill the form on the left and generate a question paper to see the preview here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaperGenerator;
