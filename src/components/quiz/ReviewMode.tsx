"use client";

import type React from 'react';
import type { Question, UserAnswer } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, XCircle, RotateCcw, Library } from 'lucide-react'; // Changed FilePlus2 to Library
import { cn } from '@/lib/utils';

interface ReviewModeProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  onRestart: () => void;
  onSelectNewSubject: () => void; // Changed prop name from onImportNew
}

const ReviewMode: React.FC<ReviewModeProps> = ({ questions, userAnswers, onRestart, onSelectNewSubject }) => {
  const getOverallScore = () => {
    const correctAnswers = userAnswers.filter(ua => ua.isCorrect).length;
    const totalQuestionsInSet = questions.length;
    const percentage = totalQuestionsInSet > 0 ? (correctAnswers / totalQuestionsInSet) * 100 : 0;
    return {
      correct: correctAnswers,
      total: totalQuestionsInSet,
      percentage: percentage.toFixed(0),
    };
  };

  const score = getOverallScore();

  return (
    <div className="w-full space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-semibold">Quiz Review</CardTitle>
          <CardDescription className="text-lg">
            You scored {score.correct} out of {score.total} ({score.percentage}%).
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Accordion type="single" collapsible className="w-full">
            {questions.map((question, index) => {
              const userAnswer = userAnswers.find(ua => ua.questionId === question.id);
              return (
                <AccordionItem value={`item-${index}`} key={question.id} className="border-b border-[hsl(var(--border))]">
                  <AccordionTrigger className="text-left hover:no-underline py-4 text-lg font-medium">
                    <div className="flex items-center w-full">
                      <span className="mr-2">
                        {userAnswer?.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-[hsl(var(--success-foreground))]" />
                        ) : userAnswer ? (
                          <XCircle className="h-5 w-5 text-[hsl(var(--error-foreground))]" />
                        ) : (
                          <span className="h-5 w-5 inline-block text-[hsl(var(--muted-foreground))]">-</span> 
                        )}
                      </span>
                      <span className="flex-1" dangerouslySetInnerHTML={{ __html: question.text }}></span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 space-y-3">
                    <div className="space-y-2">
                      {question.choices.map(choice => {
                        const isCorrectChoice = choice.id === question.correctAnswerId;
                        const isSelectedByPlayer = userAnswer?.selectedAnswerId === choice.id;

                        let choiceStyle = "bg-gray-100 text-gray-800";
                        
                        if (isCorrectChoice) {
                           choiceStyle = "bg-[hsl(var(--success-background))] text-[hsl(var(--success-foreground))] border-2 border-[hsl(var(--success-foreground))] font-medium";
                        }
                        if (isSelectedByPlayer && !isCorrectChoice) {
                           choiceStyle = "bg-[hsl(var(--error-background))] text-[hsl(var(--error-foreground))] border-2 border-[hsl(var(--error-foreground))] line-through";
                        }
                        
                        return (
                          <div
                            key={choice.id}
                            className={cn("p-3 rounded-md text-sm transition-colors duration-200", choiceStyle)}
                          >
                            {choice.text}
                            {isCorrectChoice && !isSelectedByPlayer && userAnswer && " (Correct Answer)"}
                            {isSelectedByPlayer && !isCorrectChoice && " (Your Answer - Incorrect)"}
                            {isSelectedByPlayer && isCorrectChoice && " (Your Answer - Correct)"}
                            {!userAnswer && isCorrectChoice && " (Correct Answer - Unanswered)"}
                          </div>
                        );
                      })}
                    </div>
                    {question.explanation && (
                      <div className="mt-3 p-3 bg-[hsl(var(--muted))] rounded-lg">
                        <h4 className="font-semibold text-md text-blue-700">Explanation:</h4>
                        <p className="text-sm text-blue-600">{question.explanation}</p>
                      </div>
                    )}
                     {!userAnswer && (
                      <p className="text-sm text-[hsl(var(--error-foreground))] italic mt-2">This question was not answered.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
      <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-4 mt-6">
          <Button onClick={onRestart} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 text-lg">
            <RotateCcw className="mr-2 h-5 w-5" /> <span className="text-wrap text-center">Restart Quiz with Same Questions</span>
          </Button>
          <Button onClick={onSelectNewSubject} variant="outline" className="w-full md:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg py-3 text-lg">
            <Library className="mr-2 h-5 w-5" /> <span className="text-wrap text-center">Select New Subject</span> 
          </Button>
        </div>
    </div>
  );
};

export default ReviewMode;

    