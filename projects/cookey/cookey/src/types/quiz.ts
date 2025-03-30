export interface Quiz {
  id: string;
  question: string;
  answerList: string[];
  correctAnswer: string;
  isDone: boolean;
}

export interface Deck {
  id: string;
  title: string;
  quizList: Quiz[];
  cost: number;
  isUnlock: boolean;
  points: number;
  credits: number;
}

export interface QuizWithDeck extends Quiz {
  deckId: string;
  deckTitle: string;
  quizTitle: string;
}

export interface QuizSubmission {
  deckId: string;
  deckTitle: string;
  quizId: string;
  quizTitle: string;
  selectedAnswer: string;
  timeout: boolean;
  selectedPercentage: number;
  walletAddress: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}