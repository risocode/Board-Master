"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { Question, UserAnswer } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, ChevronRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface QuizDisplayProps {
  question: Question;
  onAnswer: (questionId: string, selectedAnswerId: string, isCorrect: boolean) => void;
  onNext: () => void;
  currentIndex: number;
  totalQuestions: number;
  userAnswer: UserAnswer | undefined;
  quizSource?: 'subjects' | 'dashboard';
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({
  question,
  onAnswer,
  onNext,
  currentIndex,
  totalQuestions,
  userAnswer,
  quizSource = 'dashboard',
}) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(
    userAnswer?.selectedAnswerId || null
  );
  const [hasAnswered, setHasAnswered] = useState<boolean>(!!userAnswer);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [exitAction, setExitAction] = useState<'subjects' | 'subject' | 'home' | null>(null);

  useEffect(() => {
    setSelectedChoiceId(userAnswer?.selectedAnswerId || null);
    setHasAnswered(!!userAnswer);
  }, [question, userAnswer]);

  const handleAnswerSelect = (choiceId: string) => {
    if (hasAnswered) return;

    const isCorrect = choiceId === question.correctAnswerId;
    onAnswer(question.id, choiceId, isCorrect);
    setSelectedChoiceId(choiceId);
    setHasAnswered(true);
  };

  return (
    <Card className="w-full shadow-xl transition-all duration-500 ease-in-out bg-white/90 dark:bg-[#23272f]/90 backdrop-blur">
      <CardHeader>
        <CardDescription
          className="text-lg md:text-xl py-4 min-h-[60px] text-blue-900 dark:text-blue-100"
          dangerouslySetInnerHTML={{ __html: question.text }}
        />
        {question.items && question.items.length > 0 && (
          <ul className="list-none mt-4 space-y-2 pl-0">
            {question.items.map((item, index) => (
              <li key={index} className="text-blue-800 dark:text-blue-200 text-base md:text-lg">
                {item}
              </li>
            ))}
          </ul>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {question.choices.map((choice) => {
          const isUserSelectedChoice = selectedChoiceId === choice.id;
          const isActualCorrectAnswer = choice.id === question.correctAnswerId;

          let determinedClassName = "bg-white dark:bg-[#181c24] hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-900 dark:text-blue-100 border-2 border-blue-200 dark:border-blue-700";
          let iconToShow: React.ReactNode = null;
          let textSpanClassName = "";

          if (hasAnswered) {
            textSpanClassName = isActualCorrectAnswer ? "font-bold" : "";
            if (isActualCorrectAnswer) {
              determinedClassName = "bg-green-100 dark:bg-green-900/40 hover:bg-green-100 dark:hover:bg-green-900/40 text-green-900 dark:text-green-100 border-2 border-green-500 dark:border-green-400";
              iconToShow = <CheckCircle className="h-6 w-6" />;
            } else if (isUserSelectedChoice && !isActualCorrectAnswer) {
              determinedClassName = "bg-red-100 dark:bg-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-900 dark:text-red-100 border-2 border-red-500 dark:border-red-400";
              iconToShow = <XCircle className="h-6 w-6" />;
            } else {
              determinedClassName = "bg-gray-100 dark:bg-gray-800/40 text-gray-600 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-700 opacity-60";
            }
          }

          return (
            <Button
              key={choice.id}
              variant="outline"
              onClick={() => handleAnswerSelect(choice.id)}
              disabled={hasAnswered}
              className={cn(
                "w-full text-left h-auto text-sm md:text-lg rounded-lg transition-all duration-300 ease-in-out",
                hasAnswered ? "cursor-not-allowed transform-none" : "transform hover:scale-[1.02] hover:shadow-lg",
                determinedClassName
              )}
            >
              <div className="flex items-start gap-3 w-full">
                {iconToShow && <div className="flex-shrink-0 mt-1">{iconToShow}</div>}
                <span className={cn("flex-1 break-words whitespace-normal text-left", textSpanClassName)}>
                  {choice.text}
                </span>
              </div>
            </Button>
          );
        })}
      </CardContent>

      <CardFooter className="flex flex-col items-center pt-6 space-y-4">
        {hasAnswered && question.explanation && (
          <div className="w-full p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg shadow-sm border-2 border-blue-200 dark:border-blue-700">
            <h4 className="font-semibold text-md text-blue-900 dark:text-blue-100 mb-2">
              Explanation:
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {question.explanation}
            </p>
          </div>
        )}

        <div className="w-full flex flex-col items-center space-y-3 md:flex-row md:justify-center md:space-y-0 md:space-x-4">
          {hasAnswered && (
            <Button 
              onClick={onNext} 
              className="w-48 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold shadow-lg"
            >
              {currentIndex + 1 === totalQuestions ? "View Review" : "Next Question"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          )}
          <Button 
            onClick={() => { setShowExitConfirm(true); setExitAction(quizSource === 'subjects' ? 'subjects' : 'subject'); }} 
            variant="outline" 
            className="w-48 bg-white dark:bg-[#181c24] text-blue-900 dark:text-blue-100 border-2 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-bold shadow-lg"
          >
            Go Back
          </Button>
          <Button
            onClick={() => { setShowExitConfirm(true); setExitAction('home'); }}
            variant="outline"
            className="w-48 bg-white dark:bg-[#181c24] text-blue-900 dark:text-blue-100 border-2 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-bold shadow-lg"
          >
            Back Home
          </Button>
        </div>
      </CardFooter>

      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent className="bg-white dark:bg-[#23272f] rounded-3xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center border-2 border-blue-200 dark:border-blue-700 animate-fade-in">
          <button onClick={() => setShowExitConfirm(false)} className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-3xl font-bold">&times;</button>
          <AlertDialogTitle asChild>
            <h2 className="text-2xl font-extrabold text-blue-900 dark:text-blue-100 mb-2 text-center">Exit Quiz?</h2>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-blue-800 dark:text-blue-200">
            {exitAction === 'subjects' && 'Are you sure you want to go back to subject selection? Your answers are saved as you go.'}
            {exitAction === 'subject' && 'Are you sure you want to go back to the subject dashboard? Your answers are saved as you go.'}
            {exitAction === 'home' && 'Are you sure you want to go back to the main dashboard? Your answers are saved as you go.'}
          </AlertDialogDescription>
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => {
                if (exitAction === 'subjects') {
                  if (typeof window !== 'undefined' && window.dispatchEvent) {
                    window.dispatchEvent(new CustomEvent('goToQuizSubjectSelection'));
                  }
                } else if (exitAction === 'subject') {
                  if (typeof window !== 'undefined' && window.dispatchEvent) {
                    window.dispatchEvent(new CustomEvent('goToSubjectDashboard'));
                  }
                } else if (exitAction === 'home') {
                  if (typeof window !== 'undefined' && window.dispatchEvent) {
                    window.dispatchEvent(new CustomEvent('goToMainDashboard'));
                  }
                }
                setShowExitConfirm(false);
                setExitAction(null);
              }}
              className="w-full h-12 rounded-xl font-bold text-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200 border-2 border-red-200 dark:border-red-700 shadow hover:bg-red-200 dark:hover:bg-red-900/60 transition-all"
            >
              Exit
            </button>
            <button
              onClick={() => { setShowExitConfirm(false); setExitAction(null); }}
              className="w-full h-12 rounded-xl font-bold text-lg bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 border-2 border-blue-200 dark:border-blue-700 shadow hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all"
            >
              Stay
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default QuizDisplay;