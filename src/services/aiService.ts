
// This is a mock service for demonstration. In a real app, you would call the DeepSeek API directly.
// For now, we'll simulate responses with realistic delays.

import { QuestionPaperRequest, QuizQuestion } from '@/types';

const API_KEY = 'sk-8917d4bbdd6b46d7949860b4d55e7af4';

// Simulating network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const aiService = {
  generateQuestionPaper: async (request: QuestionPaperRequest): Promise<string> => {
    console.log('Question Paper Request:', request);
    // This would be a real API call to DeepSeek
    await delay(3000);
    
    // Mock PDF content
    return `
      # ${request.subject} Question Paper
      ## Grade ${request.grade} - ${request.board}
      
      ${request.chapters.map((chapter, i) => `
        ### ${chapter.name}
        ${Object.entries(chapter.questions).map(([type, count]) => {
          const marks = parseInt(type);
          return Array(count).fill(0).map((_, j) => 
            `Q${i+1}.${j+1} (${marks} mark${marks > 1 ? 's' : ''}): Sample question for ${chapter.name} worth ${marks} mark${marks > 1 ? 's' : ''}.`
          ).join('\n\n');
        }).join('\n\n')}
      `).join('\n\n')}
    `;
  },
  
  analyzeAnswerSheet: async (
    grade: string,
    subject: string,
    board: string,
    question: string,
    answer: string
  ): Promise<string> => {
    console.log('Analyzing answer sheet for:', { grade, subject, board });
    await delay(2000);
    
    // Mock analysis
    return `
      # Answer Evaluation
      
      ## Question
      ${question}
      
      ## Student Answer
      ${answer}
      
      ## Evaluation
      - Accuracy: 85%
      - Content Understanding: Good
      - Presentation: Average
      
      ## Feedback
      The answer demonstrates a good understanding of the core concepts. However, there are a few areas that could be improved:
      
      1. The explanation of [key concept] could be more detailed
      2. Include more examples to support your arguments
      3. The conclusion could be stronger by summarizing the main points
      
      ## Suggested Improvements
      To improve this answer, consider:
      - Adding specific examples from the textbook
      - Explaining the relationship between [concept A] and [concept B]
      - Using more precise terminology when describing [specific process]
      
      Overall, this is a good attempt that shows clear understanding of the subject matter.
    `;
  },
  
  solveDoubt: async (
    grade: string,
    subject: string,
    board: string,
    question: string
  ): Promise<string> => {
    console.log('Solving doubt for:', { grade, subject, board });
    await delay(2000);
    
    // Mock solution
    return `
      # Solution to Your Question
      
      ## Step-by-Step Solution
      
      ### Step 1: Understand the problem
      First, let's identify what we're looking for and what information is provided.
      
      ### Step 2: Plan the approach
      For this type of problem, we can use the following strategy...
      
      ### Step 3: Execute the solution
      [Detailed walkthrough with calculations/reasoning]
      
      ### Step 4: Verify the answer
      We can check our solution by [verification method]
      
      ## How to approach similar problems
      When you encounter this type of question in the future:
      
      1. Start by identifying the key concepts involved
      2. Break down the problem into smaller parts
      3. Apply the relevant formulas/principles systematically
      4. Check your work by [appropriate verification technique]
      
      This approach can be applied to a wide range of similar problems in ${subject}.
    `;
  },
  
  generateQuiz: async (
    grade: string,
    subject: string,
    board: string,
    topics: string[],
    numQuestions: number
  ): Promise<QuizQuestion[]> => {
    console.log('Generating quiz for:', { grade, subject, board, topics, numQuestions });
    await delay(2500);
    
    // Mock quiz questions
    const questions: QuizQuestion[] = [];
    
    for (let i = 0; i < numQuestions; i++) {
      questions.push({
        id: `q-${i+1}`,
        question: `Sample ${subject} question about ${topics[i % topics.length]} for grade ${grade}?`,
        options: [
          `Option A for question ${i+1}`,
          `Option B for question ${i+1}`,
          `Option C for question ${i+1}`,
          `Option D for question ${i+1}`
        ],
        correctAnswer: `Option ${['A', 'B', 'C', 'D'][i % 4]} for question ${i+1}`,
        explanation: `This is the explanation for why option ${['A', 'B', 'C', 'D'][i % 4]} is correct. It relates to the key concept of [specific topic] in ${subject}.`
      });
    }
    
    return questions;
  }
};

// PDF generation utility
export const generatePDF = async (content: string, fileName: string = 'document.pdf'): Promise<string> => {
  // In a real app, this would generate a PDF file
  // For now, we'll just return the content as a mock PDF URL
  console.log('Generating PDF with content:', content.substring(0, 100) + '...');
  await delay(1000);
  
  // Mock PDF URL that would be generated
  return `data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKNyAwIG9iago8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDEgMCBSIC9MYXN0TW9kaWZpZWQgKEQ6M`;
};
