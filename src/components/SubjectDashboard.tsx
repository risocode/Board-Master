import React from 'react';
import type { Question, UserAnswer } from '@/types/quiz';
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from 'lucide-react';

interface SubjectDashboardProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  onStartQuiz: (subjectAbbr: string) => void;
  subjectAbbreviation?: string;
  onBackToHome?: () => void;
  dark?: boolean;
  onSubjectChange?: (newAbbr: string) => void;
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
  onBackToHome,
  dark = false,
  onSubjectChange
}) => {
  const subjectList = CPA_SUBJECTS;
  const selectedSubject = subjectAbbreviation || CPA_SUBJECTS[0].abbreviation;
  const selectedSubjectInfo = subjectList.find(s => s.abbreviation === selectedSubject);

  // Filter questions and answers by selected subject
  const filteredQuestions = questions;
  const subjectQuestionIds = new Set(filteredQuestions.map(q => q.id));
  const filteredUserAnswers = userAnswers.filter(
    ua => ua.subjectAbbreviation === selectedSubject && subjectQuestionIds.has(ua.questionId)
  );

  // Check if questions failed to load
  const questionsFailedToLoad = filteredQuestions.length === 0;

  // --- Daily Stats Calculation ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dailyAnswersForSubject = filteredUserAnswers.filter(ua => {
    if (!ua.timestamp) return false;
    const answerDate = new Date(ua.timestamp);
    answerDate.setHours(0, 0, 0, 0);
    return answerDate.getTime() === today.getTime();
  });
  const dailyCorrectAnswers = dailyAnswersForSubject.filter(answer => answer.isCorrect).length;
  const dailyIncorrectAnswers = dailyAnswersForSubject.filter(answer => !answer.isCorrect).length;

  // --- Overall Subject Stats Calculation ---
  const latestAnswersForSubject = filteredUserAnswers;
  const overallSubjectCorrectAnswers = latestAnswersForSubject.filter(answer => answer.isCorrect).length;
  const overallSubjectIncorrectAnswers = latestAnswersForSubject.filter(answer => !answer.isCorrect).length;

  return (
    <div className="w-full max-w-md mx-auto mt-8 px-2">
      <div className="w-full rounded-3xl shadow-2xl p-0 bg-white/90 dark:bg-[#23272f]/90 backdrop-blur border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 pb-0">
          {/* Subject Dropdown left-aligned */}
          <div className="w-full sm:w-auto flex flex-col">
            <label className={`block text-xs font-semibold mb-1 ${dark ? 'text-blue-200' : 'text-blue-800'}`}>Choose Subject</label>
            <select
              className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 shadow transition-all duration-200 ${dark ? 'bg-[#181c24] text-blue-200 border-blue-400' : 'bg-white text-blue-800 border-blue-200'}`}
              value={selectedSubject}
              onChange={e => {
                if (onSubjectChange) onSubjectChange(e.target.value);
              }}
            >
              {subjectList.map(subj => (
                <option key={subj.abbreviation} value={subj.abbreviation}>{subj.abbreviation} - {subj.fullName}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="px-4 pt-2 pb-0">
          <div className="text-lg font-semibold text-center text-blue-700 dark:text-blue-200 mb-2">{selectedSubjectInfo?.fullName}</div>
          <div className="text-sm font-medium text-center text-blue-600 dark:text-blue-300 mb-2">Daily Performance for {selectedSubjectInfo?.abbreviation}</div>
        </div>
        <div className="px-4 pb-2">
          {questionsFailedToLoad ? (
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl shadow">
              <p className="text-red-600 dark:text-red-300 font-semibold">Failed to load questions for {selectedSubjectInfo?.abbreviation}</p>
              <Button
                onClick={() => onStartQuiz(selectedSubject)}
                className="mt-2 bg-gradient-to-r from-red-400 to-red-600 text-white font-bold shadow rounded-xl py-2 hover:from-red-500 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all"
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="rounded-xl flex flex-col items-center py-3 shadow bg-gradient-to-br from-green-100 via-white to-green-50 dark:from-green-900/60 dark:via-[#23272f] dark:to-green-800/40">
                  <span className="text-xs font-medium mb-1 text-green-700 dark:text-green-200">Daily Correct</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-300 flex items-center gap-1"><CheckCircle className="w-5 h-5" />{dailyCorrectAnswers}</span>
                </div>
                <div className="rounded-xl flex flex-col items-center py-3 shadow bg-gradient-to-br from-red-100 via-white to-red-50 dark:from-red-900/60 dark:via-[#23272f] dark:to-red-800/40">
                  <span className="text-xs font-medium mb-1 text-red-700 dark:text-red-200">Daily Incorrect</span>
                  <span className="text-xl font-bold text-red-500 dark:text-red-300 flex items-center gap-1"><XCircle className="w-5 h-5" />{dailyIncorrectAnswers}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">Answers recorded today ({new Date().toLocaleDateString()}). Resets at midnight.</div>
              <hr className="my-3 border-blue-200 dark:border-blue-800/40" />
              <div className="text-sm font-semibold mb-2 text-blue-700 dark:text-blue-200">Overall Progress</div>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="rounded-xl flex flex-col items-center py-3 shadow bg-gradient-to-br from-green-100 via-white to-green-50 dark:from-green-900/60 dark:via-[#23272f] dark:to-green-800/40">
                  <span className="text-xs font-medium mb-1 text-green-700 dark:text-green-200">Overall Correct</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-300 flex items-center gap-1"><CheckCircle className="w-5 h-5" />{overallSubjectCorrectAnswers}</span>
                </div>
                <div className="rounded-xl flex flex-col items-center py-3 shadow bg-gradient-to-br from-red-100 via-white to-red-50 dark:from-red-900/60 dark:via-[#23272f] dark:to-red-800/40">
                  <span className="text-xs font-medium mb-1 text-red-700 dark:text-red-200">Overall Incorrect</span>
                  <span className="text-xl font-bold text-red-500 dark:text-red-300 flex items-center gap-1"><XCircle className="w-5 h-5" />{overallSubjectIncorrectAnswers}</span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 px-4 pb-4 mt-2">
          <Button
            onClick={() => onStartQuiz(selectedSubject)}
            className="flex-1 bg-gradient-to-r from-pink-400 via-yellow-300 to-blue-400 text-white font-bold shadow-lg rounded-xl py-3 hover:from-pink-500 hover:to-blue-500 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all text-lg"
          >
            Start Quiz for {selectedSubjectInfo?.abbreviation}
          </Button>
          {onBackToHome && (
            <Button
              onClick={onBackToHome}
              variant="secondary"
              className="flex-1 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 text-blue-900 font-bold shadow rounded-xl py-3 hover:bg-blue-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-lg"
            >
              Back to Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectDashboard; 