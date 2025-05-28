
export type TransactionType =
  | 'CORRECT_ANSWER'
  | 'PERFECT_ANSWER'
  | 'STREAK_BONUS'
  | 'ACHIEVEMENT'
  | 'DAILY_CHECKIN';

export interface PointTransaction {
  id: string;
  userId: string;
  points: number;
  type: TransactionType;
  timestamp: string;
  questionId?: string;
  subjectAbbr?: string;
}

export interface UserPoints {
  userId: string;
  totalPoints: number;
  levelPoints: number;
  correctAnswers: number;
  perfectAnswers: number;
  lastUpdated?: string;
  transactions: PointTransaction[];
} 

export interface PointDisplay {
  currentPoints: number;
  pointsGained: number;
  isPerfectAnswer: boolean;
}