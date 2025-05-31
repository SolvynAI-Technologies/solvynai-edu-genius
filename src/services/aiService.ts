
import { QuestionPaperRequest, QuizQuestion } from '@/types';

const DEEPSEEK_API_KEY = 'sk-8917d4bbdd6b46d7949860b4d55e7af4';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// Utility function for API calls
const callDeepSeekAPI = async (prompt: string, systemPrompt: string = 'You are a helpful AI assistant.'): Promise<string> => {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    throw new Error('Failed to get response from AI service');
  }
};

export const aiService = {
  generateQuestionPaper: async (request: QuestionPaperRequest): Promise<string> => {
    console.log('Question Paper Request:', request);
    
    const prompt = `Generate a comprehensive question paper with the following specifications:
    
    Grade: ${request.grade}
    Subject: ${request.subject}
    Board: ${request.board}
    
    Chapters and Questions:
    ${request.chapters.map(chapter => `
    Chapter: ${chapter.name}
    ${Object.entries(chapter.questions).map(([marks, count]) => 
      `- ${count} questions worth ${marks} each`
    ).join('\n')}
    `).join('\n')}
    
    Please create a well-structured question paper with proper formatting, clear instructions, and age-appropriate questions for the specified grade level. Include a mix of question types (MCQ, short answer, long answer) based on the mark distribution.`;

    const systemPrompt = `You are an expert educator and question paper creator. Create educational content that is appropriate for the specified grade level and follows the curriculum standards of the given board of education. Format the output as a proper question paper with clear sections and numbering.`;

    return await callDeepSeekAPI(prompt, systemPrompt);
  },
  
  analyzeAnswerSheet: async (
    grade: string,
    subject: string,
    board: string,
    question: string,
    answer: string
  ): Promise<string> => {
    console.log('Analyzing answer sheet for:', { grade, subject, board });
    
    const prompt = `Please analyze this student's answer and provide detailed feedback:
    
    Grade: ${grade}
    Subject: ${subject}
    Board: ${board}
    
    Question: ${question}
    
    Student's Answer: ${answer}
    
    Please provide:
    1. A score out of 10
    2. Detailed analysis of correctness
    3. Areas of improvement
    4. Specific suggestions for better answers
    5. Recognition of what the student did well`;

    const systemPrompt = `You are an expert teacher and evaluator. Analyze student answers with constructive feedback, highlighting both strengths and areas for improvement. Be encouraging while being honest about the quality of the response. Provide specific, actionable advice.`;

    return await callDeepSeekAPI(prompt, systemPrompt);
  },
  
  solveDoubt: async (
    grade: string,
    subject: string,
    board: string,
    question: string
  ): Promise<string> => {
    console.log('Solving doubt for:', { grade, subject, board });
    
    const prompt = `Please help solve this academic question with a detailed explanation:
    
    Grade: ${grade}
    Subject: ${subject}
    Board: ${board}
    
    Question: ${question}
    
    Please provide:
    1. A clear, step-by-step solution
    2. Explanation of concepts involved
    3. Tips for solving similar problems
    4. Common mistakes to avoid
    5. Additional practice suggestions`;

    const systemPrompt = `You are an expert tutor specializing in ${subject}. Provide clear, step-by-step explanations that are appropriate for a ${grade} student following the ${board} curriculum. Make complex concepts easy to understand with examples and analogies when helpful.`;

    return await callDeepSeekAPI(prompt, systemPrompt);
  },
  
  generateQuiz: async (
    grade: string,
    subject: string,
    board: string,
    topics: string[],
    numQuestions: number
  ): Promise<QuizQuestion[]> => {
    console.log('Generating quiz for:', { grade, subject, board, topics, numQuestions });
    
    const prompt = `Create a quiz with ${numQuestions} multiple choice questions for:
    
    Grade: ${grade}
    Subject: ${subject}
    Board: ${board}
    Topics: ${topics.join(', ')}
    
    For each question, provide:
    1. A clear question
    2. Four multiple choice options (A, B, C, D)
    3. The correct answer
    4. A brief explanation of why the answer is correct
    
    Format as JSON array with this structure:
    [
      {
        "question": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option A",
        "explanation": "Explanation text"
      }
    ]
    
    Make sure questions are appropriate for the grade level and cover the specified topics evenly.`;

    const systemPrompt = `You are an expert quiz creator for educational content. Create engaging, challenging, and fair multiple choice questions that test understanding rather than just memorization. Ensure all options are plausible and the correct answer is clearly the best choice.`;

    try {
      const response = await callDeepSeekAPI(prompt, systemPrompt);
      
      // Try to parse JSON response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questionsData = JSON.parse(jsonMatch[0]);
        return questionsData.map((q: any, index: number) => ({
          id: `q-${index + 1}`,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        }));
      } else {
        throw new Error('Invalid JSON response');
      }
    } catch (error) {
      console.error('Error parsing quiz response:', error);
      // Fallback to mock questions if parsing fails
      const fallbackQuestions: QuizQuestion[] = [];
      for (let i = 0; i < numQuestions; i++) {
        fallbackQuestions.push({
          id: `q-${i+1}`,
          question: `Sample ${subject} question ${i+1} about ${topics[i % topics.length]} for grade ${grade}?`,
          options: [
            `Option A for question ${i+1}`,
            `Option B for question ${i+1}`,
            `Option C for question ${i+1}`,
            `Option D for question ${i+1}`
          ],
          correctAnswer: `Option ${['A', 'B', 'C', 'D'][i % 4]} for question ${i+1}`,
          explanation: `This is the explanation for why option ${['A', 'B', 'C', 'D'][i % 4]} is correct for question ${i+1}.`
        });
      }
      return fallbackQuestions;
    }
  }
};

// PDF generation utility
export const generatePDF = async (content: string, fileName: string = 'document.pdf'): Promise<string> => {
  console.log('Generating PDF with content:', content.substring(0, 100) + '...');
  
  // Simple HTML to PDF conversion (mock implementation)
  // In a real implementation, you would use a PDF library like jsPDF or a service
  const htmlContent = `
    <html>
      <head>
        <title>${fileName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1, h2, h3 { color: #333; }
          .header { text-align: center; margin-bottom: 40px; }
          .content { white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SolvynAI - Educational Content</h1>
        </div>
        <div class="content">${content.replace(/\n/g, '<br>')}</div>
      </body>
    </html>
  `;
  
  // Create a blob URL for download (mock implementation)
  const blob = new Blob([htmlContent], { type: 'text/html' });
  return URL.createObjectURL(blob);
};
