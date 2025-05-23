
export interface Choice {
  id: string;
  text: string; // Change from AnswerChoice to Choice
}

export interface Question {
  id: string;
  text: string;
  choices: Choice[];
  correctAnswerId: string;
  explanation?: string; // Optional explanation field
  // Add the new optional items field
  items?: string[];
}

export interface UserAnswer {
  questionId: string;
  selectedAnswerId: string;
  isCorrect: boolean;
  timestamp: string; // Added timestamp for daily tracking
}

