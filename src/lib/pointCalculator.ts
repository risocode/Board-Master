import { PointTransaction, UserPoints } from '../types/points';

export class PointCalculator {
  private static readonly BASE_POINTS = 2;

  // Level thresholds: [level, minPoints]
  private static readonly LEVEL_THRESHOLDS = [
    0,    // Level 1: 0-2
    3,    // Level 2: 3-9
    10,   // Level 3: 10-19
    20,   // Level 4: 20-29
    30,   // Level 5: 30-39
    // ... Level N: (N-1)*10
  ];

  static calculatePoints(
    userPoints: UserPoints,
    isCorrect: boolean,
    isFirstTry: boolean,
    questionId: string,
    subjectAbbr: string
  ): PointTransaction | null {
    if (!isCorrect) return null;

    return {
      id: crypto.randomUUID(),
      userId: userPoints.userId,
      points: this.BASE_POINTS,
      type: 'CORRECT_ANSWER',
      timestamp: new Date().toISOString(),
      questionId,
      subjectAbbr
    };
  }

  static updateUserPoints(
    userPoints: UserPoints,
    transaction: PointTransaction
  ): UserPoints {
    // Only quiz/achievement points count toward levelPoints
    const isLevelPoint = transaction.type !== 'DAILY_CHECKIN';
    return {
      ...userPoints,
      totalPoints: userPoints.totalPoints + transaction.points,
      levelPoints: userPoints.levelPoints + (isLevelPoint ? transaction.points : 0),
      correctAnswers: userPoints.correctAnswers + (transaction.type === 'CORRECT_ANSWER' ? 1 : 0),
      perfectAnswers: userPoints.perfectAnswers,
      lastUpdated: transaction.timestamp,
      transactions: [...userPoints.transactions, transaction]
    };
  }

  // --- Leveling ---
  static getLevelFromPoints(levelPoints: number): number {
    if (levelPoints < 3) return 1;
    if (levelPoints < 10) return 2;
    if (levelPoints < 20) return 3;
    if (levelPoints < 30) return 4;
    return Math.floor(levelPoints / 10) + 1;
  }

  static getPointsForNextLevel(level: number): number {
    if (level === 1) return 3;
    if (level === 2) return 10;
    if (level === 3) return 20;
    if (level === 4) return 30;
    return (level) * 10;
  }

  // --- Daily Check-In ---
  static getCheckInReward(day: number): number {
    if (day <= 1) return 5;
    if (day === 2) return 10;
    if (day === 3) return 15;
    if (day === 4) return 20;
    if (day === 5) return 25;
    if (day === 6) return 30;
    return 50; // Day 7 and beyond
  }

  static isCheckInAvailable(lastCheckInDate: string | null): boolean {
    if (!lastCheckInDate) return true;
    const last = new Date(lastCheckInDate);
    const now = new Date();
    // Only allow if not already claimed today
    return last.toDateString() !== now.toDateString();
  }
} 