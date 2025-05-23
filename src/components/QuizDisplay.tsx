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
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface QuizDisplayProps {
  question: Question;
  onAnswer: (questionId: string, selectedAnswerId: string, isCorrect: boolean) => void;
  onNext: () => void;
  currentIndex: number;
  totalQuestions: number;
  userAnswer: UserAnswer | undefined;
  onBack: () => void;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({
  question,
  onAnswer,
  onNext,
  currentIndex,
  totalQuestions,
  userAnswer,
  onBack,
}) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(
    userAnswer?.selectedAnswerId || null
  );
  const [hasAnswered, setHasAnswered] = useState<boolean>(!!userAnswer);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    setSelectedChoiceId(userAnswer?.selectedAnswerId || null);
    setHasAnswered(!!userAnswer);
  }, [question, userAnswer]);

  const handleAnswerSelect = (choiceId: string) => {
    if (hasAnswered) return;

    const isCorrect = choiceId === question.correctAnswerId;
    setSelectedChoiceId(choiceId);
    setHasAnswered(true);
    onAnswer(question.id, choiceId, isCorrect);
  };

  return (
    <Card className="w-full shadow-xl transition-all duration-500 ease-in-out">
      <CardHeader>
        <CardDescription
          className="text-lg md:text-xl py-4 min-h-[60px] text-card-foreground"
          dangerouslySetInnerHTML={{ __html: question.text }}
        />
        {question.items && question.items.length > 0 && (
          <ul className="list-none mt-4 space-y-2 pl-0">
            {question.items.map((item, index) => (
              <li key={index} className="text-card-foreground text-base md:text-lg">
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

          let determinedClassName =
            "bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]";
          let iconToShow: React.ReactNode = null;
          let textSpanClassName = "";

          if (hasAnswered) {
            textSpanClassName = isActualCorrectAnswer ? "font-bold" : "";
            if (isActualCorrectAnswer) {
              determinedClassName =
                "bg-[hsl(var(--success-background))] hover:bg-[hsl(var(--success-background))] text-[hsl(var(--success-foreground))]";
              iconToShow = <CheckCircle className="h-6 w-6" />;
            } else if (isUserSelectedChoice && !isActualCorrectAnswer) {
              determinedClassName =
                "bg-[hsl(var(--error-background))] hover:bg-[hsl(var(--error-background))] text-[hsl(var(--error-foreground))]";
              iconToShow = <XCircle className="h-6 w-6" />;
            } else {
              determinedClassName =
                "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] opacity-60";
            }
          }

          return (
            <Button
              key={choice.id}
              variant="outline"
              onClick={() => handleAnswerSelect(choice.id)}
              disabled={hasAnswered}
              className={cn(
                "w-full text-left h-auto text-sm md:text-lg rounded-lg transition-colors duration-300 ease-in-out",
                hasAnswered ? "cursor-not-allowed transform-none" : "transform hover:scale-[1.02]",
                hasAnswered && "border-transparent",
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
          <div className="w-full p-3 bg-[hsl(var(--background))] rounded-lg shadow-sm">
            <h4 className="font-semibold text-md text-[hsl(var(--foreground))]">
              Explanation:
            </h4>
            <p className="text-sm text-[hsl(var(--foreground))] opacity-90">
              {question.explanation}
            </p>
          </div>
        )}

        <div className="w-full flex flex-col items-center space-y-3 md:flex-row md:justify-center md:space-y-0 md:space-x-4">
          {hasAnswered && (
            <Button onClick={onNext} className="w-48">
              {currentIndex + 1 === totalQuestions ? "View Review" : "Next Question"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          )}
          <Button onClick={() => setShowExitConfirm(true)} variant="outline" className="w-48">
            Back to Subjects
          </Button>
        </div>
      </CardFooter>

      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center border-2 border-gray-200 animate-fade-in">
          <button onClick={() => setShowExitConfirm(false)} className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-3xl font-bold">&times;</button>
          <AlertDialogTitle asChild>
            <h2 className="text-2xl font-extrabold text-blue-900 mb-2 text-center">Exit Quiz?</h2>
          </AlertDialogTitle>
          <p className="text-base text-gray-700 mb-6 text-center">Are you sure you want to go back to subjects? Your answers are saved as you go.</p>
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => {
                onBack();
                setShowExitConfirm(false);
              }}
              className="w-full h-12 rounded-xl font-bold text-lg bg-red-100 text-red-700 border-2 border-red-200 shadow hover:bg-red-200 transition-all"
            >
              Exit
            </button>
            <button
              onClick={() => setShowExitConfirm(false)}
              className="w-full h-12 rounded-xl font-bold text-lg bg-gray-50 text-blue-900 border-2 border-gray-200 shadow hover:bg-gray-100 transition-all"
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