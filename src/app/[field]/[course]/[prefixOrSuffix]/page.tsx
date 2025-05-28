"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeProvider, useTheme } from '@/components/common/ThemeContext';
import Switch from '@/components/Switch';
import Image from 'next/image';
import Link from 'next/link';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import QuizDisplay from '@/components/quiz/QuizDisplay';
import ReviewMode from '@/components/quiz/ReviewMode';
import SubjectDashboard from '@/components/SubjectDashboard';
import type { Question, UserAnswer } from '@/types/quiz';
import type { UserPoints } from '@/types/points';
import { parseJsonQuestions } from '@/lib/parser';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, CartesianGrid, Line } from 'recharts';
import { motion } from 'framer-motion';
import { PointCalculator } from '@/lib/pointCalculator';
import { Dialog } from '@headlessui/react';
import ProfileModal from '@/components/ProfileModal';
import SpaceButton from '@/components/common/SpaceButton';
import { getProfessionalTitleAndWelcome } from '@/data/professionalTitles';
import MaintenanceModal from '@/components/common/MaintenanceModal';
import Loader from '@/components/Loader';
import HeaderAd from '@/components/common/HeaderAd';
import { useLoadingState } from '@/components/common/LoadingContext';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';


const subjects = [
  { abbreviation: 'FAR', fullName: 'Financial Accounting and Reporting' },
  { abbreviation: 'AFAR', fullName: 'Advanced Financial Accounting and Reporting' },
  { abbreviation: 'MS', fullName: 'Management Services' },
  { abbreviation: 'AT', fullName: 'Auditing Theory' },
  { abbreviation: 'AP', fullName: 'Auditing Practice' },
  { abbreviation: 'TAX', fullName: 'Taxation' },
  { abbreviation: 'RFBT', fullName: 'Regulatory Framework for Business Transactions' },
];

// Subject colors for styling
const subjectColors: { [key: string]: string } = {
  FAR: '#60a5fa',
  AFAR: '#34d399',
  MS: '#fbbf24',
  AT: '#f472b6',
  AP: '#a78bfa',
  TAX: '#f87171',
  RFBT: '#581845',
};

// Add this helper function at the top of the file, after the imports
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function DynamicCoursePage() {
  // All hooks at the top, before any early returns
  useNavigationLoading();
  const { isLoading, setIsLoading } = useLoadingState();
  const params = useParams() || {};
  const course = typeof params.course === 'string' ? params.course : Array.isArray(params.course) ? params.course[0] : '';
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizMode, setQuizMode] = useState<'quiz' | 'review'>('quiz');
  const [currentView, setCurrentView] = useState<'mainDashboard' | 'subjects' | 'quiz' | 'dashboard' | 'review' | 'overallDashboard'>('mainDashboard');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showQuizSubjectModal, setShowQuizSubjectModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showGcashModal, setShowGcashModal] = useState(false);
  const [userPoints, setUserPoints] = useState<UserPoints>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userPoints');
      if (saved) return JSON.parse(saved);
    }
    return {
      userId: 'user-id', // Replace with actual user id
      totalPoints: 0,
      levelPoints: 0,
      correctAnswers: 0,
      perfectAnswers: 0,
      transactions: [],
    };
  });
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [checkInReward, setCheckInReward] = useState<number | null>(null);
  const [checkInDay, setCheckInDay] = useState(1);
  const [lastCheckInDate, setLastCheckInDate] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastCheckInDate');
    }
    return null;
  });
  const [streak, setStreak] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('checkInStreak');
      return saved ? parseInt(saved, 10) : 1;
    }
    return 1;
  });
  const [showCheckInReward, setShowCheckInReward] = useState(false);
  const [firstName, setFirstName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userFirstName') || '';
    }
    return '';
  });
  const [middleName, setMiddleName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userMiddleName') || '';
    }
    return '';
  });
  const [lastName, setLastName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userLastName') || '';
    }
    return '';
  });
  const [hasEditedProfile, setHasEditedProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hasEditedProfile') === '1';
    }
    return false;
  });
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState<string | undefined>(undefined);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Add a helper to check if the course is CPA/BSA
  const isCPAorBSA = course === 'CPA' || course === 'BSA';

  // Add a state to track the next view after subject selection
  const [nextViewAfterSubjectSelection, setNextViewAfterSubjectSelection] = useState<'quiz' | 'dashboard' | null>(null);

  // Add a state to track how the quiz was started
  const [quizSource, setQuizSource] = useState<'subjects' | 'dashboard'>('dashboard');

  // Add a state to track the subject chart view
  const [subjectChartView, setSubjectChartView] = useState<'daily' | 'monthly'>('daily');

  // Level/progress calculation
  const level = PointCalculator.getLevelFromPoints(userPoints.levelPoints);
  const pointsForNextLevel = PointCalculator.getPointsForNextLevel(level);
  const pointsForCurrentLevel = PointCalculator.getPointsForNextLevel(level - 1) || 0;
  const progress = Math.min(1, (userPoints.levelPoints - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel));

  // Daily check-in logic
  const today = new Date().toDateString();
  const canCheckIn = PointCalculator.isCheckInAvailable(lastCheckInDate);
  const handleDailyCheckIn = () => {
    let newStreak = streak;
    let newDay = streak;
    if (lastCheckInDate) {
      const last = new Date(lastCheckInDate);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreak = streak + 1;
        newDay = newStreak > 7 ? 7 : newStreak;
      } else if (diffDays > 1) {
        newDay = 1;
        newStreak = streak;
      }
    }
    const reward = PointCalculator.getCheckInReward(newDay);
    setCheckInReward(reward);
    setCheckInDay(newDay);
    setShowCheckInReward(true);
    setCheckInModalOpen(true);
    setUserPoints(prev => {
      const updated = {
        ...prev,
        totalPoints: prev.totalPoints + reward,
        transactions: [
          ...prev.transactions,
          {
            id: crypto.randomUUID(),
            userId: prev.userId,
            points: reward,
            type: 'DAILY_CHECKIN' as const,
            timestamp: new Date().toISOString(),
          },
        ],
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPoints', JSON.stringify(updated));
      }
      return updated;
    });
    setLastCheckInDate(today);
    setStreak(newStreak);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastCheckInDate', today);
      localStorage.setItem('checkInStreak', newStreak.toString());
    }
  };

  // Define handleSubjectSelected with useCallback at the top with other hooks
  const handleSubjectSelected = useCallback(async (subjectAbbreviation: string) => {
    if (!isCPAorBSA) {
      toast({ title: "Not Available", description: "Quiz subjects are only available for CPA/BSA.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setSelectedSubject(subjectAbbreviation);
    setShowQuizSubjectModal(false);
    try {
      // Always fetch from CPA folder
      const response = await fetch(`/CPA/${subjectAbbreviation}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const importedQuestions = parseJsonQuestions(JSON.stringify(data));
      // Shuffle the questions before storing and setting
      const shuffledQuestions = shuffleArray(importedQuestions);
      localStorage.setItem(`${course}_questions_${subjectAbbreviation}`, JSON.stringify(shuffledQuestions));
      // Clear previous answers for this subject
      //setUserAnswers(prev => prev.filter(ua => !subjectQuestionIds.includes(ua.questionId)));
      setQuestions(shuffledQuestions);
      setCurrentQuestionIndex(0);
      setQuizMode('quiz');
      if (nextViewAfterSubjectSelection === 'dashboard') {
        setCurrentView('dashboard');
      } else {
        setCurrentView('quiz');
      }
      setNextViewAfterSubjectSelection(null);
    } catch {
      toast({ title: "Error", description: "Failed to load questions.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [course, isCPAorBSA, toast, nextViewAfterSubjectSelection, setIsLoading]);

  // Restore state from localStorage
  useEffect(() => {
    try {
      const savedQuestions = localStorage.getItem(`${course}_questions`);
      const savedUserAnswers = localStorage.getItem(`${course}_userAnswers`);
      const savedCurrentQuestionIndex = localStorage.getItem(`${course}_currentQuestionIndex`);
      let savedQuizMode = localStorage.getItem(`${course}_quizMode`);
      const savedCurrentView = localStorage.getItem(`${course}_currentView`);
      const savedSelectedSubject = localStorage.getItem(`${course}_selectedSubject`);
      
      if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
      if (savedUserAnswers) setUserAnswers(JSON.parse(savedUserAnswers));
      if (savedCurrentQuestionIndex !== null) setCurrentQuestionIndex(parseInt(savedCurrentQuestionIndex, 10));
      if (!savedQuizMode) savedQuizMode = 'quiz';
      setQuizMode(savedQuizMode as 'quiz' | 'review');
      if (savedSelectedSubject) setSelectedSubject(savedSelectedSubject);

      // Only restore currentView if it makes sense, otherwise default to mainDashboard
      if (
        savedCurrentView &&
        (
          savedCurrentView === 'quiz' ||
          savedCurrentView === 'review' ||
          (savedCurrentView === 'dashboard' && savedSelectedSubject && savedQuestions)
        )
      ) {
        setCurrentView(savedCurrentView as typeof currentView);
      } else {
        setCurrentView('mainDashboard');
      }
    } catch {
      setCurrentView('mainDashboard');
      setQuizMode('quiz');
    }
  }, [course]);

  // Persist state to localStorage
  useEffect(() => {
    try {
      if (questions !== null) localStorage.setItem(`${course}_questions`, JSON.stringify(questions));
      else localStorage.removeItem(`${course}_questions`);
      localStorage.setItem(`${course}_userAnswers`, JSON.stringify(userAnswers));
      localStorage.setItem(`${course}_currentQuestionIndex`, currentQuestionIndex.toString());
      localStorage.setItem(`${course}_quizMode`, quizMode);
      localStorage.setItem(`${course}_currentView`, currentView);
      if (selectedSubject) localStorage.setItem(`${course}_selectedSubject`, selectedSubject);
      else localStorage.removeItem(`${course}_selectedSubject`);
    } catch {
    }
  }, [questions, userAnswers, currentQuestionIndex, quizMode, currentView, selectedSubject, course]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleGoToSubjectDashboard() {
      setCurrentView('dashboard');
    }
    window.addEventListener('goToSubjectDashboard', handleGoToSubjectDashboard);
    return () => {
      window.removeEventListener('goToSubjectDashboard', handleGoToSubjectDashboard);
    };
  }, []);

  useEffect(() => {
    function handleGoToMainDashboard() {
      setCurrentView('mainDashboard');
    }
    window.addEventListener('goToMainDashboard', handleGoToMainDashboard);
    return () => {
      window.removeEventListener('goToMainDashboard', handleGoToMainDashboard);
    };
  }, []);

  // Listen for goToQuizSubjectSelection event
  useEffect(() => {
    function handleGoToQuizSubjectSelection() {
      setCurrentView('subjects');
    }
    window.addEventListener('goToQuizSubjectSelection', handleGoToQuizSubjectSelection);
    return () => {
      window.removeEventListener('goToQuizSubjectSelection', handleGoToQuizSubjectSelection);
    };
  }, []);

  // Add useEffect to auto-load questions for dashboard if missing
  useEffect(() => {
    if (currentView === 'dashboard') {
      // If no subject is selected, pick the first subject
      if (!selectedSubject && subjects.length > 0) {
        setSelectedSubject(subjects[0].abbreviation);
        return;
      }
      // If subject is selected but questions are missing, try to load from localStorage or fetch
      if (selectedSubject && (!questions || questions.length === 0)) {
        // Try localStorage first
        const local = localStorage.getItem(`${course}_questions_${selectedSubject}`);
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setQuestions(parsed);
              return;
            }
          } catch {
          }
        }
        // Otherwise, fetch from server
        (async () => {
          try {
            const res = await fetch(`/CPA/${selectedSubject}.json`);
            if (res.ok) {
              const data = await res.json();
              const importedQuestions = parseJsonQuestions(JSON.stringify(data));
              if (importedQuestions.length > 0) {
                setQuestions(importedQuestions);
                localStorage.setItem(`${course}_questions_${selectedSubject}`, JSON.stringify(importedQuestions));
              }
            }
          } catch {
          }
        })();
      }
    }
  }, [currentView, selectedSubject, questions, course]);

  // On mount, always load and format names from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const f = localStorage.getItem('userFirstName') || '';
      const m = localStorage.getItem('userMiddleName') || '';
      const l = localStorage.getItem('userLastName') || '';
      setFirstName(f);
      setMiddleName(m);
      setLastName(l);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return <Loader loading={isLoading} />;
  }

  const currentQuestionForQuiz = questions ? questions[currentQuestionIndex] : null;
  const userAnswerForCurrentQuestion = currentQuestionForQuiz ? userAnswers.find(ua => ua.questionId === currentQuestionForQuiz.id) : undefined;

  // Event Handlers
  const handleAnswerSelected = (questionId: string, selectedAnswerId: string, isCorrect: boolean) => {
    const newAnswer: UserAnswer = {
      questionId,
      selectedAnswerId,
      isCorrect,
      timestamp: new Date().toISOString(),
      subjectAbbreviation: selectedSubject || ''
    };
  
    // Update global answers (for dashboard/history)
    setUserAnswers(prev => {
      const updated = [...prev, newAnswer];
      try {
        localStorage.setItem(`${course}_userAnswers`, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save answer to localStorage:', error);
      }
      return updated;
    });
  
    // --- Add this for points and level progress ---
    if (isCorrect) {
      const transaction = PointCalculator.calculatePoints(
        userPoints,
        true,
        true,
        questionId,
        selectedSubject || ''
      );
      if (transaction) {
        setUserPoints(prev => {
          const updated = PointCalculator.updateUserPoints(prev, transaction);
          if (typeof window !== 'undefined') {
            localStorage.setItem('userPoints', JSON.stringify(updated));
          }
          return updated;
        });
      }
    }
  };

  const handleNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizMode('review');
      setCurrentView('review');
      toast({ title: "Quiz Completed", description: "You have finished the quiz. Review your answers." });
    }
  };

  const handleRestartQuiz = () => {
    if (questions && questions.length > 0) {
      setCurrentQuestionIndex(0);
      // Shuffle questions when restarting
      setQuestions(shuffleArray([...questions]));
      setQuizMode('quiz');
      setCurrentView('quiz');
    } else {
      setCurrentView('subjects');
    }
  };

  const handleSelectNewSubject = () => {
    setQuestions(null);
    setCurrentQuestionIndex(0);
    if (isCPAorBSA) {
    setCurrentView('subjects');
    setSelectedSubject(null);
    } else {
      setCurrentView('mainDashboard');
      setSelectedSubject(null);
    }
  };

  const handleGoToSubjectsForQuiz = () => {
    if (isCPAorBSA) {
    setCurrentView('subjects');
    } else {
      setCurrentView('mainDashboard');
    }
  };

  const handleShowMaintenance = (msg?: string) => {
    setMaintenanceMessage(msg || 'This feature is under construction.');
    setShowMaintenance(true);
  };

  // Main dashboard UI
  const renderDashboard = () => (
    <div className={`min-h-[90vh] flex flex-col items-center px-2 py-6 pt-6 relative ${theme}`}
         style={{ background: theme === 'dark' ? '#181c24' : '#eaf4fb', color: theme === 'dark' ? '#eaf4fb' : '#181c24', transition: 'background 0.3s, color 0.3s' }}>
      {/* Top right: Theme/Profile */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <Switch checked={theme === 'dark'} onChange={toggleTheme} />
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((v) => !v)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200 hover:border-blue-400 transition-all"
          >
            <Image
              src="/Icons/profile.png"
              alt="Profile"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
        </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-3 z-50 flex flex-col items-stretch animate-fade-in">
              <div className="flex flex-col items-center px-4 pb-3 border-b border-gray-100">
                <Image
                  src="/Icons/profile.png"
                  alt="Profile"
                  width={48}
                  height={48}
                  className="rounded-full mb-2"
                />
                <span className="font-bold text-gray-900 text-base truncate w-full text-center">{firstName} {middleName} {lastName}</span>
      </div>
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium"
                onClick={() => {
                  setShowDropdown(false);
                  setShowProfileModal(true);
                }}
              >
                Edit Profile
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium"
                onClick={() => {
                  setShowDropdown(false);
                  // Add logout logic here if needed
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Logo at the top, centered */}
      <div className="flex flex-col items-center mt-2 mb-2">
        <Image
          src={theme === 'dark' ? '/logo/berq-g.png' : '/logo/berq-b.png'}
          alt="Board Exam Review Questions Logo"
          width={300}
          height={100}
          style={{ width: "100%", height: "auto" }}
          priority
          className="mb-2"
        />
      </div>
      <HeaderAd />
      {/* Welcome and Edit Profile */}
      <div className="flex flex-col items-center mb-4 w-full">
        <div className="text-center font-extrabold text-4xl md:text-5xl mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 text-transparent bg-clip-text drop-shadow-lg tracking-wide select-none transition-all duration-300 w-full">
          WELCOME
        </div>
        <div className="w-full max-w-md mx-auto mb-2 flex justify-center items-center">
        {!hasEditedProfile ? (
          <SpaceButton
            label="Edit Profile"
            onClick={() => setShowProfileModal(true)}
          />
        ) : (
          <SpaceButton
            label={(() => {
              const name = [firstName, middleName, lastName].filter(Boolean).join(' ');
              const { title } = getProfessionalTitleAndWelcome(course);
              let displayName = '';
              if (!title) displayName = name;
              else if (title.endsWith('.')) displayName = `${title} ${name}`;
              else displayName = `${name}${title ? ', ' + title : ''}`;
              const length = displayName.length;
              return (
                <span
                  style={{
                    fontSize:
                      length > 24 ? '1.1rem' : length > 16 ? '1.3rem' : '1.5rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                    maxWidth: '100%',
                    textAlign: 'center',
                  }}
                  title={displayName}
                >
                  {displayName}
                </span>
              );
            })()}
            disabled
          />
        )}
        </div>
      </div>
      {/* Main Action Buttons */}
      <div className="flex flex-col items-center w-full max-w-md mx-auto gap-4 mb-6">
      <Button
        onClick={() => {
            if (!isCPAorBSA || subjects.length === 0) {
              handleShowMaintenance('Take Quiz is under construction for this course.');
              return;
            }
          setQuizSource('subjects');
          setShowQuizSubjectModal(true);
        }}
          className="w-full h-14 rounded-xl bg-pink-200 text-pink-900 font-bold text-lg shadow-md hover:bg-pink-300 transition"
      >
        Take Quiz
      </Button>
      <Button
        onClick={() => {
            if (!isCPAorBSA || subjects.length === 0) {
              handleShowMaintenance('Subject Dashboard is under construction for this course.');
              return;
            }
          setQuizSource('dashboard');
          if (!selectedSubject) {
            setSelectedSubject(subjects[0].abbreviation);
          }
          setCurrentView('dashboard');
        }}
          className="w-full h-14 rounded-xl border-2 border-blue-400 text-blue-800 font-semibold text-lg bg-white shadow hover:bg-blue-50 hover:border-blue-600 transition"
        variant="outline"
      >
        Subject Dashboard
      </Button>
      <Button
          onClick={() => {
            if (!isCPAorBSA || subjects.length === 0) {
              handleShowMaintenance('Overall Dashboard is under construction for this course.');
              return;
            }
            setCurrentView('overallDashboard');
          }}
          className="w-full h-14 rounded-xl border-2 border-blue-400 text-blue-800 font-semibold text-lg bg-white shadow hover:bg-blue-50 hover:border-blue-600 transition"
        variant="outline"
      >
        Overall Dashboard
      </Button>
      </div>
      {/* Menu Bar - Level, Points, Daily Check In */}
        <div className="w-full max-w-xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-green-50 shadow-lg rounded-2xl px-3 py-2 sm:px-6 sm:py-4 gap-3 sm:gap-6 border border-blue-100">
          {/* Level and Progress */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 w-full">
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-500 font-medium">Lvl</span>
              <span className="text-xl sm:text-2xl font-bold text-blue-900 leading-none">{level}</span>
            </div>
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className="relative w-full h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-500 shadow-inner"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 mt-1">Progress to next level</span>
            </div>
          </div>

          {/* Points */}
          <div className="flex items-center gap-1 mx-0 sm:mx-6 mt-2 sm:mt-0">
            <span className="text-yellow-500 text-xl animate-pulse">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" stroke="gold" strokeWidth="2" fill="yellow" /></svg>
            </span>
            <span className="font-bold text-gray-800 text-lg">{userPoints.totalPoints}</span>
            <span className="text-xs text-gray-500 ml-1">points</span>
          </div>

          {/* Daily Check-In Button */}
          <button
            className="w-full sm:w-auto mt-2 sm:mt-0 px-5 py-2 rounded-xl border border-green-300 bg-white text-green-700 font-semibold shadow-sm hover:bg-green-50 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-green-200 focus:outline-none"
            onClick={() => {
              if (canCheckIn) {
                handleDailyCheckIn();
              } else {
                setCheckInModalOpen(true);
              }
            }}
          >
            Daily Check In
          </button>
        </div>
      </div>
      {/* Footer container at the bottom */}
      <div className="w-full flex flex-col items-center mt-auto pt-8">
        <div className="w-full max-w-md mx-auto mb-4">
          <button
          onClick={() => setShowGcashModal(true)}
            className="bg-yellow-100 border border-yellow-300 rounded-xl shadow flex items-center justify-center px-4 py-3 mb-2 w-full"
        >
            <span className="text-2xl mr-2 animate-bounce">☕</span>
            <span className="font-bold text-yellow-900">Buy Me a Coffee</span>
          </button>
        </div>
        <div className="flex flex-row items-center justify-center gap-x-8 w-full max-w-md mb-2 whitespace-nowrap">
          <Link href="/privacy" className="text-blue-700 hover:underline text-sm font-medium flex items-center gap-1">
            <span>🔒</span> Privacy Policy
          </Link>
          <Link href="/terms" className="text-blue-700 hover:underline text-sm font-medium flex items-center gap-1">
            <span>📜</span> Terms of Use
          </Link>
          <Link href="/contact" className="text-blue-700 hover:underline text-sm font-medium flex items-center gap-1">
            <span>✉️</span> Contact
          </Link>
        </div>
        <div className="w-full text-center text-xs text-gray-500 mt-2">
          All rights reserved Risoca © {new Date().getFullYear()}
        </div>
      </div>
      <MaintenanceModal
        open={showMaintenance}
        onClose={() => setShowMaintenance(false)}
        courseName={course}
        message={maintenanceMessage}
        onChangeCourse={() => {
          setIsLoading(true);
          setShowMaintenance(false);
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        }}
      />
    </div>
  );

  // UI rendering
  const renderContent = () => {
    // Always render the dashboard UI
    switch (currentView) {
      case 'quiz':
        if (isLoading) {
          return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <Loader loading={isLoading} />
            </div>
          );
        }
        if (questions && currentQuestionForQuiz) {
          return (
            <QuizDisplay
              key={currentQuestionForQuiz.id}
              question={currentQuestionForQuiz}
              onAnswer={handleAnswerSelected}
              onNext={handleNextQuestion}
              currentIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              userAnswer={userAnswerForCurrentQuestion}
              quizSource={quizSource}
              userPoints={userPoints}
              onPointsUpdate={setUserPoints} 
            />
          );
        } else {
          return (
            <div className="text-center p-10 bg-card rounded-lg shadow-lg">
              <Image src="https://placehold.co/300x200.png" alt="No questions loaded" width={300} height={200} className="mx-auto mb-4 rounded-md" />
              <h2 className="text-2xl font-semibold mb-2 text-card-foreground">No Questions Loaded</h2>
              <p className="text-muted-foreground mb-4">Please select a subject to start.</p>
              <Button onClick={handleGoToSubjectsForQuiz} className="mr-2">Select Subject</Button>
            </div>
          );
        }
      case 'review':
        if (questions && questions.length > 0) {
          return (
            <ReviewMode
              questions={questions}
              userAnswers={userAnswers.filter(ua => questions.some(q => q.id === ua.questionId))}
              onRestart={handleRestartQuiz}
              onSelectNewSubject={handleSelectNewSubject}
            />
          );
        } else {
          return (
            <div className="text-center p-10 bg-card rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-2 text-card-foreground">No Questions to Review</h2>
              <p className="text-muted-foreground mb-4">There are no completed questions to review.</p>
              <Button onClick={handleGoToSubjectsForQuiz}>Back to Subjects</Button>
            </div>
          );
        }
      case 'subjects':
        return (
          <div className="min-h-[90vh] flex flex-col items-center justify-center bg-[#f0f6ff] px-2 py-6">
            <div className="w-full max-w-lg bg-white/60 rounded-xl shadow-lg p-4 flex flex-col items-center">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-blue-700 text-center drop-shadow-sm">
                Choose a Subject
              </h2>
              <div className="flex flex-col items-center gap-5 w-full">
                {subjects.map((subject) => (
                  <div key={subject.abbreviation} className="relative group w-full flex items-center justify-center">
                    {/* Glowing blurred gradient background (dark mode only) */}
                    {theme === 'dark' && (
                      <div className="absolute inset-0 rounded-xl blur-lg filter opacity-60 transition-all duration-700 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 group-hover:opacity-100 group-hover:duration-200" />
                    )}
                    {/* Actual button */}
                    <button
                      type="button"
                      className={`relative z-10 w-full flex flex-col items-center justify-center text-base rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400
                        ${theme === 'dark'
                          ? 'bg-gray-900 px-6 py-2 text-white hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30'
                          : 'bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 px-6 py-2 text-blue-900 hover:bg-blue-200 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-blue-200/30'}
                      `}
                      onClick={async () => {
                        setQuizSource('subjects');
                        setShowQuizSubjectModal(false);
                        await handleSubjectSelected(subject.abbreviation);
                      }}
                    >
                      <span className={`text-lg font-extrabold w-full text-center mb-0.5 ${theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>{subject.abbreviation}</span>
                      <span className={`text-xs font-medium w-full text-center mt-0.5 break-words whitespace-normal max-w-full overflow-hidden ${theme === 'dark' ? 'text-white/80' : 'text-blue-700'}`}>{subject.fullName}</span>
                    </button>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setCurrentView('mainDashboard')}
                className="w-full mt-8 bg-yellow-100 text-pink-600 font-bold rounded-xl hover:bg-yellow-200 transition text-lg"
                variant="secondary"
              >
                Back to Home
              </Button>
            </div>
          </div>
        );
        case 'dashboard':
          if (isLoading || !selectedSubject || questions === null) {
            return (
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader loading={isLoading} />
              </div>
            );
          }
          if (questions.length === 0) {
            // Only show this if we know there are no questions for the selected subject
            return (
              <div className="text-center p-10 bg-card rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-2 text-card-foreground">Dashboard Not Available</h2>
                <p className="text-muted-foreground mb-4">Please select a subject with questions to view its dashboard.</p>
                <Button onClick={() => setCurrentView('mainDashboard')} className="mr-2">Back to Home</Button>
              </div>
            );
          }
        // In the dashboard case, filter userAnswers for the current subject
        return (
          <div className="flex flex-col items-center">
          <SubjectDashboard
            questions={questions || []}
            userAnswers={userAnswers || []}
            subjectAbbreviation={selectedSubject || ''}
            onStartQuiz={async (subjectAbbr) => {
              setQuizSource('dashboard');
              if (!subjectAbbr) return;
              const validSubjects = subjects.map(s => s.abbreviation);
              if (!validSubjects.includes(subjectAbbr)) {
                toast({ title: "Invalid Subject", description: `Cannot start quiz for ${subjectAbbr}.`, variant: "destructive" });
                return;
              }
              setIsLoading(true);
              try {
                const res = await fetch(`/CPA/${subjectAbbr}.json`);
                if (res.ok) {
                  const data = await res.json();
                  const subjectQuestions = parseJsonQuestions(JSON.stringify(data));
                  if (subjectQuestions.length > 0) {
                    // DO NOT clear userAnswers here!
                    setQuestions(shuffleArray(subjectQuestions));
                    setCurrentQuestionIndex(0);
                    setQuizMode('quiz');
                    setCurrentView('quiz');
                    setSelectedSubject(subjectAbbr);
                  } else {
                    toast({ title: "Error", description: `No questions found for ${subjectAbbr}.`, variant: "destructive" });
                  }
                } else {
                  toast({ title: "Error", description: `Failed to load questions for ${subjectAbbr}.`, variant: "destructive" });
                }
              } finally {
                setIsLoading(false);
              }
            }}
            onBackToHome={() => setCurrentView('mainDashboard')}
            dark={theme === 'dark'}
            onSubjectChange={abbr => setSelectedSubject(abbr)}
          />
          </div>
        );
      case 'overallDashboard':
        // Build a questionId-to-subject map from all available questions in localStorage and current state
        const questionIdToSubject: Record<string, string> = {};
        // 1. From all localStorage subject files
        subjects.forEach(subject => {
          try {
            const data = localStorage.getItem(`${course}_questions_${subject.abbreviation}`);
            if (data) {
              const questions = JSON.parse(data);
              if (Array.isArray(questions)) {
                questions.forEach((q) => {
                  if (q && typeof q === 'object' && 'id' in q) {
                    questionIdToSubject[q.id] = subject.abbreviation;
                  }
                });
              }
            }
          } catch {
          }
        });
        // 2. From current questions in state
        if (questions && selectedSubject) {
          questions.forEach(q => {
            if (!questionIdToSubject[q.id]) {
              questionIdToSubject[q.id] = selectedSubject;
            }
          });
        }
        // 3. Fallback: for any userAnswer not mapped, use selectedSubject if possible
        userAnswers.forEach(ans => {
          if (!questionIdToSubject[ans.questionId] && selectedSubject) {
            questionIdToSubject[ans.questionId] = selectedSubject;
          }
        });
        // Aggregate stats from all subjects
        const allUserAnswers = userAnswers;
        const overallTotalAnswered = allUserAnswers.length;
        const overallTotalCorrect = allUserAnswers.filter(ans => ans.isCorrect).length;
        
        // Aggregate daily and monthly data for all subjects
        const dailyMap: Record<string, Record<string, number>> = {};
        const monthlyMap: Record<string, Record<string, number>> = {};
        const dailyQuestionsMap: Record<string, number> = {};
        
        allUserAnswers.forEach(ans => {
          const ts = typeof ans.timestamp === 'string' ? ans.timestamp : String(ans.timestamp);
          const date = ts.slice(0, 10);
          const month = ts.slice(0, 7);
          
          // Daily subject breakdown
          if (!dailyMap[date]) dailyMap[date] = {};
          const subject = questionIdToSubject[ans.questionId];
          if (subject) {
            dailyMap[date][subject] = (dailyMap[date][subject] || 0) + 1;
          }
          
          // Monthly subject breakdown
          if (!monthlyMap[month]) monthlyMap[month] = {};
          if (subject) {
            monthlyMap[month][subject] = (monthlyMap[month][subject] || 0) + 1;
          }
          
          // Daily questions total
          dailyQuestionsMap[date] = (dailyQuestionsMap[date] || 0) + 1;
        });

        // Convert to chart data
        const dailySubjectData = Object.entries(dailyMap)
          .map(([date, subjCounts]) => ({
            date,
            ...subjects.reduce((acc, s) => ({ ...acc, [s.abbreviation]: subjCounts[s.abbreviation] || 0 }), {} as Record<string, number>),
          }))
          .sort((a, b) => a.date.localeCompare(b.date));

        const monthlySubjectData = Object.entries(monthlyMap)
          .map(([month, subjCounts]) => ({
            month,
            ...subjects.reduce((acc, s) => ({ ...acc, [s.abbreviation]: subjCounts[s.abbreviation] || 0 }), {} as Record<string, number>),
          }))
          .sort((a, b) => a.month.localeCompare(b.month));

        const dailyQuestionsData = Object.entries(dailyQuestionsMap)
          .map(([date, count]) => ({ date, questions: count }))
          .sort((a, b) => a.date.localeCompare(b.date));

        return (
          <div className="relative min-h-[80vh] flex flex-col items-center justify-center w-full max-w-3xl mx-auto py-8 px-2 sm:px-6 md:px-10">
            {/* Decorative Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-green-400/10 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full flex flex-col items-center mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl md:text-5xl">📊</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 drop-shadow text-center">
                  Overall Dashboard
                </h2>
              </div>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 text-center max-w-2xl">
                See your overall progress, accuracy, and activity across all subjects. Use this dashboard to track your improvement and stay motivated!
              </p>
            </motion.div>

            {/* Stat Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full mb-8">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center min-h-[80px]">
                <span className="text-base sm:text-lg font-semibold text-blue-800 dark:text-blue-200 mb-1">Total Answered</span>
                <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-300">{overallTotalAnswered}</span>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-800/40 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center min-h-[80px]">
                <span className="text-base sm:text-lg font-semibold text-green-800 dark:text-green-200 mb-1">Total Correct</span>
                <span className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-300">{overallTotalCorrect}</span>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/40 dark:to-yellow-800/40 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center min-h-[80px]">
                <span className="text-base sm:text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Accuracy</span>
                <span className="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-300">
                  {overallTotalAnswered > 0 ? ((overallTotalCorrect / overallTotalAnswered) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </motion.div>

            {/* Charts Section */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="z-10 w-full bg-white/90 dark:bg-[#23272f]/90 backdrop-blur rounded-2xl shadow-2xl p-6 md:p-10 border border-white/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div className="flex items-center gap-2">
                  <button
                    className={`px-3 py-1 rounded-l-full border border-blue-300 text-blue-800 font-semibold transition text-sm sm:text-base ${subjectChartView === 'daily' ? 'bg-blue-200' : 'bg-white dark:bg-[#23272f]'}`}
                    onClick={() => setSubjectChartView('daily')}
                  >
                    Daily
                  </button>
                  <button
                    className={`px-3 py-1 rounded-r-full border border-blue-300 text-blue-800 font-semibold transition text-sm sm:text-base -ml-px ${subjectChartView === 'monthly' ? 'bg-blue-200' : 'bg-white dark:bg-[#23272f]'}`}
                    onClick={() => setSubjectChartView('monthly')}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {subjectChartView === 'daily' ? (
                <>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-blue-800">Subjects Taken (Daily)</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={dailySubjectData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="date" fontSize={10} />
                      <YAxis allowDecimals={false} fontSize={10} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      {subjects.map(s => (
                        <Bar key={s.abbreviation} dataKey={s.abbreviation} stackId="a" fill={subjectColors[s.abbreviation as keyof typeof subjectColors] || '#8884d8'} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </>
              ) : (
                <>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-blue-800">Subjects Taken (Monthly)</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={monthlySubjectData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="month" fontSize={10} />
                      <YAxis allowDecimals={false} fontSize={10} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      {subjects.map(s => (
                        <Bar key={s.abbreviation} dataKey={s.abbreviation} stackId="a" fill={subjectColors[s.abbreviation as keyof typeof subjectColors] || '#8884d8'} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}

              <h3 className="text-lg sm:text-xl font-bold mb-2 text-blue-800 mt-6">Questions Taken Daily</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={dailyQuestionsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" fontSize={10} />
                  <YAxis allowDecimals={false} fontSize={10} />
                  <Tooltip />
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="questions" stroke="#f59e42" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <Button onClick={() => setCurrentView('mainDashboard')} variant="secondary" className="mt-8 w-full max-w-xs z-10">
              Back to Home
            </Button>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  // For daily check-in modal: build claimed days array
  const claimedDays = Array(7).fill(false);
  for (let i = 0; i < Math.min(streak, 7); i++) {
    claimedDays[i] = true;
  }

  return (
    <ThemeProvider>
      <main className="w-full max-w-4xl mx-auto p-4 md:p-8 font-sans transition-all duration-500 ease-in-out">
        {currentView === 'dashboard' && selectedSubject && questions && questions.length > 0 && (
          <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-6">
            Subject Dashboard
          </h1>
        )}
        {currentView === 'mainDashboard' && renderDashboard()}
        {currentView !== 'mainDashboard' && renderContent()}
      </main>
      <Toaster />
      {/* Daily Check-In Modal */}
      <Dialog open={checkInModalOpen} onClose={() => setCheckInModalOpen(false)} className="fixed z-50 inset-0 flex items-center justify-center">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/60" inert />
        {/* Modal Content */}
        <div className="relative bg-[#181c24] rounded-2xl p-6 max-w-sm w-full flex flex-col items-center border-2 border-green-700 animate-fade-in shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-1 text-center">Daily Check In</h2>
          <div className="text-gray-300 text-sm mb-6 text-center">You have consecutively checked in for <span className="font-bold text-green-400">{streak}</span> day(s).</div>
          <div className="w-full flex flex-col items-center mb-8">
            <div className="grid grid-cols-4 gap-3 mb-3 w-full justify-items-center">
              {Array.from({ length: 4 }).map((_, i) => {
                const isCurrent = i + 1 === checkInDay;
                const isClaimed = claimedDays[i];
                return (
                  <div
                    key={i}
                    className={`relative flex flex-col items-center justify-center rounded-xl p-2 w-20 h-24 border border-gray-700 bg-[#23272f] transition-all duration-200 overflow-hidden`}
                  >
                    {/* Overlay for claimed days */}
                    {isClaimed && (
                      <>
                        <span className="absolute inset-0 flex items-center justify-center z-20">
                          <span className="bg-white rounded-full p-1 flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
                          </span>
                        </span>
                      </>
                    )}
                    {/* Day label and icon, faded if claimed */}
                    <span className={`mt-1 ${isCurrent ? 'text-white font-extrabold text-lg md:text-2xl' : 'text-white text-base font-bold'} ${isClaimed ? 'opacity-40' : ''}`}>
                      Day {i + 1}
                    </span>
                    <span className={`mt-2 ${isClaimed ? 'opacity-40' : ''}`}>
                      {/* Coin SVG */}
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="16" fill="#FFD700" />
                        <circle cx="16" cy="16" r="13" fill="#F6C700" />
                        <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#B8860B">₵</text>
                      </svg>
                    </span>
        </div>
                );
              })}
            </div>
            <div className="grid grid-cols-4 gap-3 w-full justify-items-center">
              {/* Day 5 */}
              {(() => {
                const i = 4;
                const isCurrent = i + 1 === checkInDay;
                const isClaimed = claimedDays[i];
                return (
                  <div
                    key={i}
                    className={`relative flex flex-col items-center justify-center rounded-xl p-2 w-20 h-24 border border-gray-700 bg-[#23272f] transition-all duration-200 overflow-hidden`}
                  >
                    {/* Overlay for claimed days */}
                    {isClaimed && (
                      <>
                        <span className="absolute inset-0 flex items-center justify-center z-20">
                          <span className="bg-white rounded-full p-1 flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        </span>
                      </>
                    )}
                    {/* Day label and icon, faded if claimed */}
                    <span className={`mt-1 ${isCurrent ? 'text-white font-extrabold text-lg md:text-2xl' : 'text-white text-base font-bold'} ${isClaimed ? 'opacity-40' : ''}`}>
                      Day {i + 1}
                    </span>
                    <span className={`mt-2 ${isClaimed ? 'opacity-40' : ''}`}>
                      {/* Coin SVG */}
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="16" fill="#FFD700" />
                        <circle cx="16" cy="16" r="13" fill="#F6C700" />
                        <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#B8860B">₵</text>
                      </svg>
                    </span>
          </div>
                );
              })()}
              {/* Day 6 */}
              {(() => {
                const i = 5;
                const isCurrent = i + 1 === checkInDay;
                const isClaimed = claimedDays[i];
                return (
                  <div
                    key={i}
                    className={`relative flex flex-col items-center justify-center rounded-xl p-2 w-20 h-24 border border-gray-700 bg-[#23272f] transition-all duration-200 overflow-hidden`}
                  >
                    {/* Overlay for claimed days */}
                    {isClaimed && (
                      <>
                        <span className="absolute inset-0 flex items-center justify-center z-20">
                          <span className="bg-white rounded-full p-1 flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        </span>
                      </>
                    )}
                    {/* Day label and icon, faded if claimed */}
                    <span className={`mt-1 ${isCurrent ? 'text-white font-extrabold text-lg md:text-2xl' : 'text-white text-base font-bold'} ${isClaimed ? 'opacity-40' : ''}`}>
                      Day {i + 1}
                    </span>
                    <span className={`mt-2 ${isClaimed ? 'opacity-40' : ''}`}>
                      {/* Coin SVG */}
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="16" fill="#FFD700" />
                        <circle cx="16" cy="16" r="13" fill="#F6C700" />
                        <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#B8860B">₵</text>
                      </svg>
                    </span>
        </div>
                );
              })()}
              {/* Day 7 */}
              {(() => {
                const i = 6;
                const isCurrent = i + 1 === checkInDay;
                const isClaimed = claimedDays[i];
                return (
                  <div
                    key={i}
                    className={`relative flex flex-col items-center justify-center rounded-xl p-2 h-24 col-span-2 w-full border border-gray-700 bg-[#23272f] transition-all duration-200 overflow-hidden`}
                  >
                    {/* Overlay for claimed days */}
                    {isClaimed && (
                      <>
                        <span className="absolute inset-0 flex items-center justify-center z-20">
                          <span className="bg-white rounded-full p-1 flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        </span>
                      </>
                    )}
                    {/* Day label and icon, faded if claimed */}
                    <span className={`mt-1 ${isCurrent ? 'text-white font-extrabold text-lg md:text-2xl' : 'text-white text-base font-bold'} ${isClaimed ? 'opacity-40' : ''}`}>
                      Day {i + 1}
                    </span>
                    <span className={`mt-2 flex justify-center items-center w-full ${isClaimed ? 'opacity-40' : ''}`}>
                      {/* Gift SVG */}
                      <svg width="70" height="70" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                        <rect x="6" y="14" width="24" height="16" rx="3" fill="#FFD700" />
                        <rect x="10" y="18" width="16" height="8" rx="2" fill="#FFB300" />
                        <rect x="16" y="14" width="4" height="16" fill="#FF5252" />
                        <rect x="6" y="14" width="24" height="4" fill="#FF5252" />
                        <rect x="12" y="6" width="12" height="8" rx="4" fill="#FFD700" />
                        <rect x="16" y="6" width="4" height="8" fill="#FF5252" />
                      </svg>
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
          <div className="text-lg font-bold text-green-400 mb-1 text-center">Day {checkInDay}</div>
          <div className="flex flex-col items-center justify-center mb-6 min-h-[48px]">
            {showCheckInReward ? (
              <div className="flex items-center gap-2 text-amber-400 text-2xl font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-amber-400">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#FFD700" />
                </svg>
                +{checkInReward} points
              </div>
            ) : (
              <>
                <p className="text-lg font-semibold text-green-400">Already claimed!</p>
                <p className="text-base text-gray-200">Come back tomorrow.</p>
              </>
            )}
          </div>
          <div className="w-full flex justify-center mt-2">
            <Button
              className="w-full bg-green-500 text-white font-bold text-lg py-2 rounded-xl hover:bg-green-600 transition-all"
              onClick={() => { setCheckInModalOpen(false); setShowCheckInReward(false); }}
            >
              Close
            </Button>
          </div>
        </div>
      </Dialog>
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          courseType={course}
          middleName={middleName}
          setMiddleName={setMiddleName}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          setHasEditedProfile={setHasEditedProfile}
        />
      )}
      {showGcashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center relative animate-fade-in border-2 border-yellow-200">
            <button onClick={() => setShowGcashModal(false)} className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-3xl font-bold">&times;</button>
            <div className="flex flex-col items-center mb-2">
              <span className="text-4xl mb-2 animate-bounce">☕❤️</span>
              <h2 className="text-2xl font-extrabold text-yellow-800 mb-1 text-center">Support the App!</h2>
              <p className="text-base text-gray-700 mb-2 text-center">If you find this app helpful, you can buy me a coffee and help keep it free for everyone. Your support means a lot! 🙏</p>
            </div>
            <div className="bg-yellow-50 border-4 border-yellow-300 rounded-2xl shadow-lg p-2 mb-4 flex flex-col items-center">
              <Image src="/Gcash/gcash.jpg" alt="GCash QR Code" width={192} height={192} className="w-48 h-48 object-contain rounded-xl" />
              <span className="text-xs text-gray-500 mt-2">Scan with your GCash app</span>
            </div>
            <p className="text-center text-yellow-900 text-sm font-semibold">Thank you for your generosity and for supporting Filipino board exam takers! 💙</p>
          </div>
        </div>
      )}
      {/* Quiz Subject Modal */}
      {showQuizSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div
            className={`relative w-full max-w-md rounded-3xl shadow-2xl border transition-all duration-300 my-8 sm:my-12
              ${theme === 'dark'
                ? 'bg-[#181c24] border-blue-900 p-8 sm:p-8'
                : 'bg-gradient-to-br from-white via-blue-50 to-blue-100 border-blue-200 p-8 sm:p-8'}
            `}
            style={{ minWidth: '360px' }}
          >
            <button onClick={() => setShowQuizSubjectModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl font-bold transition-all">&times;</button>
            <h2 className="text-2xl font-extrabold text-pink-700 dark:text-pink-300 mb-5 text-center drop-shadow">Choose a Subject</h2>
            <div className="flex flex-col gap-3 w-full mt-2">
              {subjects.map((subject) => (
                <div key={subject.abbreviation} className="relative group w-full flex items-center justify-center">
                  {/* Glowing blurred gradient background (dark mode only) */}
                  {theme === 'dark' && (
                    <div className="absolute inset-0 rounded-xl blur-lg filter opacity-60 transition-all duration-700 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 group-hover:opacity-100 group-hover:duration-200" />
                  )}
                  {/* Actual button */}
                  <button
                    type="button"
                    className={`relative z-10 w-full flex flex-col items-center justify-center text-base rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400
                      ${theme === 'dark'
                        ? 'bg-gray-900 px-6 py-2 text-white hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30'
                        : 'bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 px-6 py-2 text-blue-900 hover:bg-blue-200 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-blue-200/30'}
                    `}
                    onClick={async () => {
                      setQuizSource('subjects');
                      setShowQuizSubjectModal(false);
                      await handleSubjectSelected(subject.abbreviation);
                    }}
                  >
                    <span className={`text-lg font-extrabold w-full text-center mb-0.5 ${theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>{subject.abbreviation}</span>
                    <span className={`text-xs font-medium w-full text-center mt-0.5 break-words whitespace-normal max-w-full overflow-hidden ${theme === 'dark' ? 'text-white/80' : 'text-blue-700'}`}>{subject.fullName}</span>
                  </button>
                </div>
              ))}
            </div>
            <Button onClick={() => setShowQuizSubjectModal(false)} className={`w-full mt-8 rounded-xl font-bold transition text-base py-2
              ${theme === 'dark' ? 'bg-yellow-900 text-pink-200 hover:bg-yellow-800' : 'bg-yellow-100 text-pink-600 hover:bg-yellow-200'}`}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
} 