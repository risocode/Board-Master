import React, { useState } from 'react';
import type { Question, UserAnswer } from '@/types/quiz';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, XCircle, CalendarDays } from 'lucide-react';

interface SubjectDashboardProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  onStartQuiz: (subjectAbbr: string) => void;
  subjectAbbreviation?: string;
  subjectFullName?: string;
  onBackToHome?: () => void;
  dark?: boolean;
}

const CPA_SUBJECTS = [
  { abbreviation: 'FAR', fullName: 'Financial Accounting and Reporting' },
  { abbreviation: 'AFAR', fullName: 'Advanced Financial Accounting and Reporting' },
  { abbreviation: 'MS', fullName: 'Management Services' },
  { abbreviation: 'AT', fullName: 'Auditing Theory' },
  { abbreviation: 'AP', fullName: 'Auditing Practice' },
  { abbreviation: 'TAX', fullName: 'Taxation' },
  { abbreviation: 'RFBT', fullName: 'Regulatory Framework for Business Transactions' },
];

const SubjectDashboard: React.FC<SubjectDashboardProps> = ({ 
  questions, 
  userAnswers, 
  onStartQuiz, 
  subjectAbbreviation,
  subjectFullName,
  onBackToHome,
  dark = false
}) => {
  // Subject filter state
  const [selectedSubject, setSelectedSubject] = useState<string>(subjectAbbreviation || CPA_SUBJECTS[0].abbreviation);
  const subjectList = CPA_SUBJECTS;
  const selectedSubjectInfo = subjectList.find(s => s.abbreviation === selectedSubject);

  // Filter questions and answers by selected subject
  const filteredQuestions = questions.filter(q => q.id.startsWith(selectedSubject));
  const subjectQuestionIds = new Set(filteredQuestions.map(q => q.id));
  const filteredUserAnswers = userAnswers.filter(ua => subjectQuestionIds.has(ua.questionId));

  // --- Daily Stats Calculation ---
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight for accurate daily comparison

  const dailyAnswersForSubject = filteredUserAnswers.filter(ua => {
    if (!ua.timestamp) return false;
    const answerDate = new Date(ua.timestamp);
    answerDate.setHours(0, 0, 0, 0);
    return answerDate.getTime() === today.getTime();
  });

  const dailyCorrectAnswers = dailyAnswersForSubject.filter(answer => answer.isCorrect).length;
  const dailyIncorrectAnswers = dailyAnswersForSubject.filter(answer => !answer.isCorrect).length;

  // --- Overall Subject Stats Calculation (based on latest attempt per question for this subject) ---
  const latestAnswersForSubject = filteredUserAnswers;
  const overallSubjectCorrectAnswers = latestAnswersForSubject.filter(answer => answer.isCorrect).length;
  const overallSubjectIncorrectAnswers = latestAnswersForSubject.filter(answer => !answer.isCorrect).length;
  
  return (
    <div className="w-full max-w-md mx-auto mt-4 px-2">
      <Card className="w-full shadow-lg p-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 pb-0">
          {/* Subject Dropdown left-aligned */}
          <div className="w-full sm:w-auto flex flex-col">
            <label className={`block text-xs font-semibold mb-1 ${dark ? 'text-blue-200' : 'text-blue-800'}`}>Choose Subject</label>
            <select
              className={`rounded-lg border-2 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow ${dark ? 'bg-[#181c24] text-blue-200 border-blue-400' : 'bg-white text-blue-800 border-blue-200'}`}
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
            >
              {subjectList.map(subj => (
                <option key={subj.abbreviation} value={subj.abbreviation}>{subj.abbreviation} - {subj.fullName}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="px-4 pt-2 pb-0">
          {/* Subject Name as Main Heading */}
          <h2 className="text-3xl font-extrabold text-blue-900 mb-2 text-left">{selectedSubjectInfo?.fullName}</h2>
          {/* Subheading */}
          <div className="text-sm text-blue-700 mb-2 font-semibold">Daily Performance for {selectedSubjectInfo?.abbreviation}</div>
        </div>
        {/* Compact Stats Grid */}
        <div className="px-4 pb-2">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-blue-50 rounded-lg flex flex-col items-center py-2">
              <span className="text-xs text-blue-800 font-medium mb-1">Daily Correct</span>
              <span className="text-lg font-bold text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" />{dailyCorrectAnswers}</span>
            </div>
            <div className="bg-blue-50 rounded-lg flex flex-col items-center py-2">
              <span className="text-xs text-blue-800 font-medium mb-1">Daily Incorrect</span>
              <span className="text-lg font-bold text-red-500 flex items-center gap-1"><XCircle className="w-4 h-4" />{dailyIncorrectAnswers}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mb-2">Answers recorded today ({new Date().toLocaleDateString()}). Resets at midnight.</div>
          <hr className="my-3 border-blue-200" />
          <div className="text-sm text-blue-700 mb-2 font-semibold">Overall Progress</div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-blue-50 rounded-lg flex flex-col items-center py-2">
              <span className="text-xs text-blue-800 font-medium mb-1">Overall Correct</span>
              <span className="text-lg font-bold text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" />{overallSubjectCorrectAnswers}</span>
            </div>
            <div className="bg-blue-50 rounded-lg flex flex-col items-center py-2">
              <span className="text-xs text-blue-800 font-medium mb-1">Overall Incorrect</span>
              <span className="text-lg font-bold text-red-500 flex items-center gap-1"><XCircle className="w-4 h-4" />{overallSubjectIncorrectAnswers}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 px-4 pb-4 mt-2">
          <Button onClick={() => onStartQuiz(selectedSubject)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">Start Quiz for {selectedSubjectInfo?.abbreviation}</Button>
          {onBackToHome && (
            <Button onClick={onBackToHome} variant="secondary" className="flex-1">Back to Home</Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SubjectDashboard;
