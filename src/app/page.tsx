"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Question, UserAnswer } from '@/types/quiz';
import { parseJsonQuestions } from '@/lib/parser';
import QuizDisplay from '@/components/QuizDisplay';
import ReviewMode from '@/components/ReviewMode';
import SubjectDashboard from '@/components/SubjectDashboard';
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import SignUpForm from '../components/SignUpForm';
import Loader from '../components/Loader';
import SpaceButton from '../components/SpaceButton';
import { ThemeProvider, useTheme } from '../components/ThemeContext';
import Switch from '../components/Switch';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

type QuizMode = 'quiz' | 'review';
type AppView = 'home' | QuizMode | 'subjects' | 'dashboard' | 'overallDashboard';

const subjects = [
  { abbreviation: 'FAR', fullName: 'Financial Accounting and Reporting' },
  { abbreviation: 'AFAR', fullName: 'Advanced Financial Accounting and Reporting' },
  { abbreviation: 'MS', fullName: 'Management Services' },
  { abbreviation: 'AT', fullName: 'Auditing Theory' },
  { abbreviation: 'AP', fullName: 'Auditing Practice' },
  { abbreviation: 'TAX', fullName: 'Taxation' },
  { abbreviation: 'RFBT', fullName: 'Regulatory Framework for Business Transactions' },
];

const QUOTES = [
  "Success is the sum of small efforts, repeated day in and day out.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "Believe you can and you're halfway there.",
  "Opportunities don't happen, you create them.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Don't stop when you're tired. Stop when you're done.",
  "Education is the most powerful weapon which you can use to change the world.",
  "Strive for progress, not perfection.",
  "Mistakes are proof that you are trying.",
  "Your limitation—it's only your imagination.",
  "Sometimes later becomes never. Do it now.",
  "Little by little, a little becomes a lot.",
  "Doubt kills more dreams than failure ever will.",
  "You don't have to be great to start, but you have to start to be great.",
  "Difficult roads often lead to beautiful destinations.",
  "The expert in anything was once a beginner."
];

// Add a color map for subjects
const subjectColors: Record<string, string> = {
  FAR: '#60a5fa', // blue
  AFAR: '#34d399', // green
  MS: '#fbbf24', // yellow
  AT: '#f472b6', // pink
  AP: '#a78bfa', // purple
  TAX: '#f87171', // red
  RFBT: '#581845', // light blue
};

const FIELDS = [
  {
    icon: '🩺',
    name: 'Health & Allied Sciences',
    courses: [
      { abbr: 'BSN', name: 'Bachelor of Science in Nursing' },
      { abbr: 'BSP', name: 'Bachelor of Science in Pharmacy' },
      { abbr: 'BSMT/BSMLS', name: 'Medical Technology / Medical Laboratory Science' },
      { abbr: 'BSPT', name: 'Physical Therapy' },
      { abbr: 'BSOT', name: 'Occupational Therapy' },
      { abbr: 'DMD', name: 'Doctor of Dental Medicine' },
      { abbr: 'BSM', name: 'Midwifery' },
      { abbr: 'BSRT', name: 'Radiologic Technology' },
      { abbr: 'BSNND', name: 'Nutrition and Dietetics' },
      { abbr: 'BSSLP', name: 'Speech-Language Pathology' },
      { abbr: 'BSRespT', name: 'Respiratory Therapy' },
      { abbr: 'BSOA', name: 'Optometry' },
    ],
  },
  {
    icon: '⚖️',
    name: 'Law & Criminology',
    courses: [
      { abbr: 'JD/LLB', name: 'Juris Doctor / Bachelor of Laws' },
      { abbr: 'BSCrim', name: 'Bachelor of Science in Criminology' },
    ],
  },
  {
    icon: '🧠',
    name: 'Education',
    courses: [
      { abbr: 'BEEd', name: 'Bachelor of Elementary Education' },
      { abbr: 'BSEd', name: 'Bachelor of Secondary Education' },
      { abbr: 'BECEd', name: 'Bachelor of Early Childhood Education' },
      { abbr: 'BSNEd', name: 'Bachelor of Special Needs Education' },
      { abbr: 'BPEd', name: 'Bachelor of Physical Education' },
      { abbr: 'BTTEd', name: 'Bachelor of Technical Teacher Education' },
    ],
  },
  {
    icon: '🏛️',
    name: 'Engineering',
    courses: [
      { abbr: 'BSCE', name: 'Civil Engineering' },
      { abbr: 'BSME', name: 'Mechanical Engineering' },
      { abbr: 'BSEE', name: 'Electrical Engineering' },
      { abbr: 'BSECE', name: 'Electronics Engineering' },
      { abbr: 'BSChE', name: 'Chemical Engineering' },
      { abbr: 'BSGE', name: 'Geodetic Engineering' },
      { abbr: 'BSMineE', name: 'Mining Engineering' },
      { abbr: 'BSSE', name: 'Sanitary Engineering' },
      { abbr: 'BSMtE', name: 'Metallurgical Engineering' },
      { abbr: 'BSComEng', name: 'Computer Engineering' },
      { abbr: 'BSAeroE', name: 'Aeronautical Engineering' },
      { abbr: 'BSIE', name: 'Industrial Engineering' },
    ],
  },
  {
    icon: '📊',
    name: 'Business & Accountancy',
    courses: [
      { abbr: 'BSA', name: 'Accountancy' },
      { abbr: 'BSCA', name: 'Customs Administration' },
      { abbr: 'BSREM', name: 'Real Estate Management' },
    ],
  },
  {
    icon: '🛠️',
    name: 'Architecture & Design',
    courses: [
      { abbr: 'BSA', name: 'Architecture' },
      { abbr: 'BSID', name: 'Interior Design' },
      { abbr: 'BSLA', name: 'Landscape Architecture' },
      { abbr: 'BFA', name: 'Fine Arts (Industrial Design)' },
    ],
  },
  {
    icon: '🧪',
    name: 'Sciences',
    courses: [
      { abbr: 'BSChem', name: 'Chemistry' },
      { abbr: 'BSGeo', name: 'Geology' },
      { abbr: 'BSF', name: 'Forestry' },
      { abbr: 'BSAgri', name: 'Agriculture' },
    ],
  },
];

function HomePageInner(): JSX.Element {
  const router = useRouter();
  // --- All useState hooks ---
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizMode, setQuizMode] = useState<QuizMode>('quiz');
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [nextViewAfterSubjectSelection, setNextViewAfterSubjectSelection] = useState<'quiz' | 'dashboard' | null>(null);
  const [showQuote, setShowQuote] = useState(false);
  const [showFirework, setShowFirework] = useState(false);
  const [fireworks, setFireworks] = useState<{id: string, rotate: number, delay: number, offsetX: number, offsetY: number}[]>([]);
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [subjectChartView, setSubjectChartView] = useState<'daily' | 'monthly'>('daily');
  const [selectedFieldIdx, setSelectedFieldIdx] = useState<number|null>(null);
  const [selectedCourseIdx, setSelectedCourseIdx] = useState<number|null>(null);
  const [isCPASelected, setIsCPASelected] = useState(false);
  const [showGcashModal, setShowGcashModal] = useState(false);
  const [showQuizSubjectModal, setShowQuizSubjectModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profile, setProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userProfile');
      if (saved) return JSON.parse(saved);
    }
    return { firstName: '', middleName: '', lastName: '', age: '', birthdate: '', address: '' };
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('isLoggedIn');
    }
    return false;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [loginTarget, setLoginTarget] = useState<'quiz' | 'dashboard' | 'overallDashboard' | null>(null);
  const [quizSource, setQuizSource] = useState<'dashboard' | 'subjects' | null>(null);

  // --- All useRef hooks ---
  const logoRef = useRef<HTMLDivElement>(null);
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const previousViewRef = useRef<AppView | null>(null);

  // --- All useContext hooks ---
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  // --- All useCallback hooks ---
  const shuffleArray = useCallback((array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }, []);

  const handleQuestionsLoaded = useCallback((loadedQuestions: Question[], mode: 'quiz' | 'dashboard', showToast: boolean = false) => {
    if (loadedQuestions.length > 0) {
      const shuffledQuestions = shuffleArray([...loadedQuestions]);
      setQuestions(shuffledQuestions);
      if (mode === 'quiz') {
        setCurrentQuestionIndex(0);
      }
      setQuizMode('quiz');
      if (showToast) {
        toast({ title: "Questions Loaded", description: `Loaded ${loadedQuestions.length} questions.` });
      }
    } else {
      if (showToast) {
        toast({
          title: "Load Failed",
          description: "No questions were loaded for the selected subject.",
          variant: "destructive",
        });
      }
    }
  }, [toast, shuffleArray]);

  const handleSubjectSelected = useCallback(async (subjectAbbreviation: string) => {
    setIsLoading(true);
    setSelectedSubject(subjectAbbreviation);
    try {
      const response = await fetch(`/CPA/${subjectAbbreviation}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const importedQuestions = parseJsonQuestions(JSON.stringify(data));
      localStorage.setItem('cpaReview_questions_' + subjectAbbreviation, JSON.stringify(importedQuestions));
      const loadMode = nextViewAfterSubjectSelection === 'dashboard' ? 'dashboard' : 'quiz';
      handleQuestionsLoaded(importedQuestions, loadMode, false);
      if (importedQuestions.length > 0) {
        if (nextViewAfterSubjectSelection === 'dashboard') {
          setCurrentView('dashboard');
        } else {
          setCurrentView('quiz');
        }
      } else {
        setQuestions(null);
        setCurrentView('subjects');
        toast({
          title: "Load Failed",
          description: `No questions found for ${subjectAbbreviation}.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error Loading Subject",
        description: `Could not load questions for ${subjectAbbreviation}. ${error instanceof Error ? error.message : ''}`,
        variant: "destructive",
      });
      setQuestions(null);
      setCurrentView('subjects');
    } finally {
      setIsLoading(false);
    }
  }, [toast, nextViewAfterSubjectSelection, handleQuestionsLoaded]);

  // --- All useEffect hooks ---
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      const savedQuestions = localStorage.getItem('cpaReview_questions');
      const savedUserAnswers = localStorage.getItem('cpaReview_userAnswers');
      const savedCurrentQuestionIndex = localStorage.getItem('cpaReview_currentQuestionIndex');
      let savedQuizMode = localStorage.getItem('cpaReview_quizMode');
      const savedCurrentView = localStorage.getItem('cpaReview_currentView');
      const savedSelectedSubject = localStorage.getItem('cpaReview_selectedSubject');
      // Restore field, course, and CPA state
      const savedFieldIdx = localStorage.getItem('selectedFieldIdx');
      const savedCourseIdx = localStorage.getItem('selectedCourseIdx');
      const savedIsCPASelected = localStorage.getItem('isCPASelected');
      if (savedFieldIdx !== null && savedFieldIdx !== '') setSelectedFieldIdx(Number(savedFieldIdx));
      if (savedCourseIdx !== null && savedCourseIdx !== '') setSelectedCourseIdx(Number(savedCourseIdx));
      if (savedIsCPASelected === 'true') setIsCPASelected(true);
      if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
      if (savedUserAnswers) setUserAnswers(JSON.parse(savedUserAnswers));
      if (savedCurrentQuestionIndex !== null) setCurrentQuestionIndex(parseInt(savedCurrentQuestionIndex, 10));
      if (!savedQuizMode) {
        savedQuizMode = 'quiz';
      }
      setQuizMode(savedQuizMode as QuizMode);
      if (savedSelectedSubject) setSelectedSubject(savedSelectedSubject);
      if (savedCurrentView && (savedQuestions || savedCurrentView === 'home' || savedCurrentView === 'subjects' || (savedCurrentView === 'dashboard' && savedSelectedSubject))) {
        setCurrentView(savedCurrentView as AppView);
      } else if (savedQuestions && savedQuizMode) {
         setCurrentView('quiz'); 
      } else {
        setCurrentView('home');
        setQuizMode('quiz'); 
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      setCurrentView('home');
      setQuizMode('quiz');
    }
  }, []);

  useEffect(() => {
    if (session && !isLoggedIn) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      if (loginTarget === 'quiz') {
        setShowQuizSubjectModal(true);
      } else if (loginTarget === 'dashboard') {
        setCurrentView('dashboard');
      } else if (loginTarget === 'overallDashboard') {
        setCurrentView('overallDashboard');
      }
      setLoginTarget(null);
    }
  }, [session]);

  // Persist field, course, and CPA state
  useEffect(() => {
    localStorage.setItem('selectedFieldIdx', selectedFieldIdx !== null ? String(selectedFieldIdx) : '');
    localStorage.setItem('selectedCourseIdx', selectedCourseIdx !== null ? String(selectedCourseIdx) : '');
    localStorage.setItem('isCPASelected', isCPASelected ? 'true' : 'false');
  }, [selectedFieldIdx, selectedCourseIdx, isCPASelected]);

  useEffect(() => {
    try {
      if (questions !== null) localStorage.setItem('cpaReview_questions', JSON.stringify(questions));
      else localStorage.removeItem('cpaReview_questions');
      localStorage.setItem('cpaReview_userAnswers', JSON.stringify(userAnswers));
      localStorage.setItem('cpaReview_currentQuestionIndex', currentQuestionIndex.toString());
      localStorage.setItem('cpaReview_quizMode', quizMode);
      localStorage.setItem('cpaReview_currentView', currentView);
      if (selectedSubject) localStorage.setItem('cpaReview_selectedSubject', selectedSubject);
      else localStorage.removeItem('cpaReview_selectedSubject');
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [questions, userAnswers, currentQuestionIndex, quizMode, currentView, selectedSubject]);

  useEffect(() => {
    setShowQuote(false);
  }, [currentView]);

  // --- Early return for loading spinner ---
  if (!mounted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentQuestionForQuiz = questions ? questions[currentQuestionIndex] : null;
  const userAnswerForCurrentQuestion = currentQuestionForQuiz ? userAnswers.find(ua => ua.questionId === currentQuestionForQuiz.id) : undefined;

  const handleAnswerSelected = (questionId: string, selectedAnswerId: string, isCorrect: boolean) => {
    const newAnswer: UserAnswer = { 
      questionId, 
      selectedAnswerId, 
      isCorrect,
      timestamp: new Date().toISOString() // Add timestamp
    };
    setUserAnswers(prev => [...prev.filter(ans => ans.questionId !== questionId), newAnswer]);
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
      const currentSubjectQuestionIds = questions.map(q => q.id);
      setUserAnswers(prev => prev.filter(ua => !currentSubjectQuestionIds.includes(ua.questionId)));
      setCurrentQuestionIndex(0);
      setQuestions(shuffleArray([...questions])); // Re-shuffle current questions
      setQuizMode('quiz'); 
      setCurrentView('quiz'); 
    } else {
      setCurrentView('home');
    }
  };
  
  const handleSelectNewSubject = () => {
    setQuestions(null); 
    setCurrentQuestionIndex(0);
    setNextViewAfterSubjectSelection('quiz'); 
    setCurrentView('subjects');
    setSelectedSubject(null);
  };

  const handleGoToSubjectsForQuiz = () => {
    setQuizSource('subjects');
    setNextViewAfterSubjectSelection('quiz');
    setCurrentView('subjects');
  };

  const handleGoToSubjectsForDashboard = () => {
    setNextViewAfterSubjectSelection('dashboard');
    setCurrentView('subjects');
  };

  const handleGoHome = () => {
    setCurrentView('home');
  };

  const handleBackToSubjects = () => {
    if (quizSource === 'dashboard') {
          setCurrentView('dashboard');
        } else { 
      setNextViewAfterSubjectSelection(quizMode === 'review' ? 'quiz' : nextViewAfterSubjectSelection);
        setCurrentView('subjects'); 
    }
  };

  const handleLogoClick = () => {
    if (isLongPress.current) {
      isLongPress.current = false;
      return; // Don't show fireworks if it was a long press
    }
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
    // Create 10 fireworks with random offsets and rotations
    const fw = Array.from({ length: 10 }).map(() => ({
      id: Math.random().toString(36),
      rotate: Math.floor(Math.random() * 360),
      delay: Math.random() * 0.3,
      offsetX: Math.floor(Math.random() * 120) - 60, // -60px to +60px
      offsetY: Math.floor(Math.random() * 60) - 30,  // -30px to +30px
    }));
    setFireworks(fw);
    setTimeout(() => setFireworks([]), 1400);
  };

  // Long press handler
  const handleLogoMouseDown = () => {
    isLongPress.current = false;
    longPressTimeout.current = setTimeout(() => {
      setShowQuote(true);
      isLongPress.current = true;
    }, 400); // 400ms for long press
  };
  const handleLogoMouseUp = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  };
  const handleQuoteClose = () => setShowQuote(false);

  const showPrevQuote = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setQuoteIndex((prev) => (prev - 1 + QUOTES.length) % QUOTES.length);
  };
  const showNextQuote = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
  };

  // Build a questionId-to-subject map from all loaded questions
  const questionIdToSubject: Record<string, string> = {};
  subjects.forEach(subject => {
    try {
      const data = localStorage.getItem('cpaReview_questions_' + subject.abbreviation);
      if (data) {
        const questions = JSON.parse(data);
        questions.forEach((q: any) => {
          questionIdToSubject[q.id] = subject.abbreviation;
        });
      }
    } catch {}
  });
  // Fallback: also map from current questions in state
  if (questions) {
    questions.forEach(q => {
      if (!questionIdToSubject[q.id] && selectedSubject) {
        questionIdToSubject[q.id] = selectedSubject;
      }
    });
  }
  // Only consider userAnswers with a valid subject mapping
  const validUserAnswers = userAnswers.filter(ans => !!questionIdToSubject[ans.questionId]);
  // Use validUserAnswers for all dashboard stats
  const totalAnswered = validUserAnswers.length;
  const totalCorrect = validUserAnswers.filter(ans => ans.isCorrect).length;
  // Aggregate userAnswers by day and month for subject activity
  const dailySubjectDataMap: Record<string, Record<string, number>> = {};
  const monthlySubjectDataMap: Record<string, Record<string, number>> = {};
  const dailyQuestionsDataMap: Record<string, number> = {};
  validUserAnswers.forEach(ans => {
    const subject = questionIdToSubject[ans.questionId];
    if (!subject) return;
    const date = ans.timestamp.slice(0, 10); // YYYY-MM-DD
    const month = ans.timestamp.slice(0, 7); // YYYY-MM
    // Daily subject
    if (!dailySubjectDataMap[date]) dailySubjectDataMap[date] = {};
    dailySubjectDataMap[date][subject] = (dailySubjectDataMap[date][subject] || 0) + 1;
    // Monthly subject
    if (!monthlySubjectDataMap[month]) monthlySubjectDataMap[month] = {};
    monthlySubjectDataMap[month][subject] = (monthlySubjectDataMap[month][subject] || 0) + 1;
    // Daily questions
    dailyQuestionsDataMap[date] = (dailyQuestionsDataMap[date] || 0) + 1;
  });
  // Convert to recharts data arrays
  const dailySubjectData = Object.entries(dailySubjectDataMap).map(([date, subjCounts]) => ({
    date,
    ...subjects.reduce((acc, s) => ({ ...acc, [s.abbreviation]: subjCounts[s.abbreviation] || 0 }), {})
  })).sort((a, b) => a.date.localeCompare(b.date));
  const monthlySubjectData = Object.entries(monthlySubjectDataMap).map(([month, subjCounts]) => ({
    month,
    ...subjects.reduce((acc, s) => ({ ...acc, [s.abbreviation]: subjCounts[s.abbreviation] || 0 }), {})
  })).sort((a, b) => a.month.localeCompare(b.month));
  const dailyQuestionsData = Object.entries(dailyQuestionsDataMap).map(([date, questions]) => ({ date, questions })).sort((a, b) => a.date.localeCompare(b.date));

  // Add debug logs for chart data
  console.debug('DASHBOARD CHART DATA', {
    dailySubjectData,
    monthlySubjectData,
    dailyQuestionsData,
    validUserAnswers,
    questionIdToSubject,
  });

  // Update the handleResetDashboard function
  const handleResetDashboard = () => {
    // Clear all localStorage keys for this app
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cpaReview_')) {
        localStorage.removeItem(key);
      }
    });

    // Reset all state variables
    setUserAnswers([]);
    setQuestions(null);
    setCurrentQuestionIndex(0);
    setQuizMode('quiz');
    setSelectedSubject(null);
    setNextViewAfterSubjectSelection(null);
    setCurrentView('home');
    setShowQuote(false);
    setShowFirework(false);
    setFireworks([]);
    setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
    setSubjectChartView('daily');
    setIsCPASelected(false);
    setSelectedFieldIdx(null);
    setSelectedCourseIdx(null);
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    setShowLoginModal(false);
    setShowProfileModal(false);
    setShowProfileEdit(false);
    setShowGcashModal(false);
    setShowQuizSubjectModal(false);
    setAuthError(null);
  };

  // Add this function to handle authentication
  const handleAuthentication = async (email: string, password: string) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      // Simulate authentication with a 2 second delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      setShowLoginModal(false);
      setShowQuizSubjectModal(true);
    } catch (error) {
      setAuthError('Authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Helper to get full name
  const getFullName = () => {
    if (!profile.firstName && !profile.lastName) return '{Edit Profile}';
    return `${profile.firstName} ${profile.middleName} ${profile.lastName}`.replace(/  +/g, ' ').trim();
  };

  const handleProceedAfterCourseSelection = async () => {
    if (typeof selectedFieldIdx !== 'number' || selectedCourseIdx === null) return;
    setIsLoading(true);
    // Add a delay to simulate loading
    await new Promise(resolve => setTimeout(resolve, 1500));
    const selectedField = FIELDS[selectedFieldIdx];
    const selectedCourse = selectedField.courses[selectedCourseIdx];
    // Always redirect to onboarding with course abbreviation
    router.push(`/onboarding?course=${encodeURIComponent(selectedCourse.abbr)}`);
    setIsLoading(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        if (isCPASelected) {
        return (
            <div className={`min-h-[90vh] flex flex-col items-center px-2 py-6 pt-6 relative ${theme}`}
                 style={{ background: theme === 'dark' ? '#181c24' : '#eaf4fb', color: theme === 'dark' ? '#eaf4fb' : '#181c24', transition: 'background 0.3s, color 0.3s' }}>
              {/* Theme Switch and Profile Icon - only show after course selection */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                {/* Only show Switch and profile icon if isCPASelected and isLoggedIn */}
                {isCPASelected && isLoggedIn && (
                  <>
                    <Switch checked={theme === 'dark'} onChange={toggleTheme} />
                    <button onClick={() => setShowProfileModal(true)} className="rounded-full border-2 border-gray-300 w-10 h-10 flex items-center justify-center bg-white shadow hover:shadow-lg transition">
                      <span className="text-2xl">👤</span>
                      </button>
                  </>
                )}
              </div>
              {/* Logo */}
              <div className="flex flex-col items-center mb-6 mt-2">
                <Image
                  src="/logo/berq.png"
                  alt="Board Exam Review Questions Logo"
                  width={220}
                  height={100}
                  priority
                  className="mb-2"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
              {/* User Name and CPA */}
              {isLoggedIn && (
                <div className={`text-xl font-bold text-center mb-6 ${theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>{getFullName()}, CPA</div>
              )}
              {/* Main Buttons */}
              <Button
                onClick={() => {
                  if (!isLoggedIn) {
                    setLoginTarget('quiz');
                    setShowLoginModal(true);
                  } else {
                    setShowQuizSubjectModal(true);
                  }
                }}
                className="w-full max-w-md h-14 mb-4 rounded-xl bg-pink-200 text-pink-900 font-bold text-lg shadow-md hover:bg-pink-300 transition"
              >
                Take Quiz
              </Button>
              <Button
                onClick={() => {
                  if (!isLoggedIn) {
                    setLoginTarget('dashboard');
                    setShowLoginModal(true);
                  } else {
                    setCurrentView('dashboard');
                  }
                }}
                className="w-full max-w-md h-14 mb-4 rounded-xl border-2 border-blue-400 text-blue-800 font-semibold text-lg bg-white shadow hover:bg-blue-50 hover:border-blue-600 transition"
                variant="outline"
              >
                Subject Dashboard
              </Button>
              <Button
                onClick={() => {
                  if (!isLoggedIn) {
                    setLoginTarget('overallDashboard');
                    setShowLoginModal(true);
                  } else {
                    setCurrentView('overallDashboard');
                  }
                }}
                className="w-full max-w-md h-14 mb-4 rounded-xl border-2 border-blue-400 text-blue-800 font-semibold text-lg bg-white shadow hover:bg-blue-50 hover:border-blue-600 transition"
                variant="outline"
              >
                Overall Dashboard
              </Button>
              {/* Footer container */}
              <div className="w-full max-w-xs flex flex-col items-center mt-8 border-t border-gray-200 pt-4 gap-2">
                <button onClick={() => setShowGcashModal(true)} className="text-yellow-800 font-bold bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2 shadow hover:bg-yellow-200 hover:scale-105 transition-all duration-150 flex items-center gap-2">
                  <span className="text-2xl">☕</span> Buy Me a Coffee
                </button>
                <div className="flex flex-row items-center justify-center gap-4 mt-2">
                  <Link href="/guides" className="text-blue-700 hover:underline text-sm font-medium flex items-center gap-1">
                    <span>📖</span> Guides
                  </Link>
                  <Link href="/privacy" className="text-blue-700 hover:underline text-sm font-medium flex items-center gap-1">
                    <span>🔒</span> Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-blue-700 hover:underline text-sm font-medium flex items-center gap-1">
                    <span>📜</span> Terms of Use
                  </Link>
                </div>
                <div className="w-full text-center text-xs text-gray-500 mt-2">
                  All rights reserved Risoca © {new Date().getFullYear()}
                </div>
              </div>
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
                      <img src="/Gcash/gcash.jpg" alt="GCash QR Code" className="w-48 h-48 object-contain rounded-xl" />
                      <span className="text-xs text-gray-500 mt-2">Scan with your GCash app</span>
                    </div>
                    <p className="text-center text-yellow-900 text-sm font-semibold">Thank you for your generosity and for supporting Filipino board exam takers! 💙</p>
                  </div>
                </div>
              )}
              {/* Login Modal */}
              {showLoginModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="rounded-2xl shadow-2xl p-4 w-full max-w-xs mx-auto flex flex-col items-center relative animate-fade-in">
                    <button onClick={() => setShowLoginModal(false)} className="absolute top-3 right-5 text-red-500 hover:text-red-700 text-2xl font-bold p-0 m-0 bg-transparent border-none outline-none z-10">&times;</button>
                    <SignUpForm />
                    {authError && (
                      <div className="mt-2 text-red-600 text-sm">{authError}</div>
                    )}
                    {isAuthenticating && (
                      <div className="mt-2 flex justify-center">
                        <Loader />
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Quiz Subject Modal */}
              {showQuizSubjectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                  <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 max-w-sm w-full flex flex-col items-center relative animate-fade-in border-2 border-pink-200">
                    <button onClick={() => setShowQuizSubjectModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-3xl font-bold transition-all">&times;</button>
                    <h2 className="text-2xl font-extrabold text-pink-700 mb-4 text-center drop-shadow">Choose a Subject</h2>
                    <div className="flex flex-col gap-4 w-full mt-2">
                      {subjects.map((subject, idx) => (
              <Button
                          key={subject.abbreviation}
                          className={`w-full min-h-[70px] px-2 py-3 rounded-xl font-bold text-lg shadow-md transition-all flex flex-col items-center justify-center text-center
                            ${idx % 2 === 0
                              ? 'bg-gradient-to-r from-pink-200 via-yellow-100 to-pink-100 text-pink-900 border-2 border-pink-200 hover:from-pink-300 hover:to-yellow-200'
                              : 'bg-gradient-to-r from-yellow-100 via-pink-100 to-yellow-200 text-yellow-900 border-2 border-yellow-200 hover:from-yellow-200 hover:to-pink-200'}
                          `}
                          style={{ letterSpacing: '0.04em' }}
                          onClick={async () => {
                            setShowQuizSubjectModal(false);
                            setIsLoading(true);
                            try {
                              const res = await fetch(`/CPA/${subject.abbreviation}.json`);
                              if (res.ok) {
                                const data = await res.json();
                                const questions = parseJsonQuestions(JSON.stringify(data));
                                if (questions.length > 0) {
                                  setQuestions(questions);
                                  setCurrentQuestionIndex(0);
                                  setQuizMode('quiz');
                                  setCurrentView('quiz');
                                  setSelectedSubject(subject.abbreviation);
                                  toast({ title: "Success", description: `Loaded ${questions.length} questions for ${subject.abbreviation}.` });
                                } else {
                                  toast({ title: "No Questions", description: `No questions found for ${subject.abbreviation}.`, variant: "destructive" });
                                }
                              } else {
                                throw new Error(`Failed to load questions for ${subject.abbreviation}`);
                              }
                            } catch (error) {
                              toast({ title: "Error", description: `Failed to load questions for ${subject.abbreviation}.`, variant: "destructive" });
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                        >
                          <span className="text-lg font-bold w-full text-center">{subject.abbreviation}</span>
                          <span className="text-xs text-pink-700/70 mt-1 font-normal w-full text-center break-words" style={{lineHeight:1.2}}>{subject.fullName}</span>
              </Button>
                      ))}
            </div>
                  </div>
                </div>
              )}
              {/* Profile Modal */}
              {showProfileModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                  <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center relative animate-fade-in border border-blue-200">
                    <button onClick={() => { setShowProfileModal(false); setShowProfileEdit(false); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl font-bold">&times;</button>
                    {/* User Avatar/Icon and Profile Edit */}
                    {showProfileEdit ? (
                      <div className="flex flex-col items-center mb-4 mt-2 w-full">
                        <button onClick={() => setShowProfileEdit(false)} className="self-start mb-2 text-blue-700 hover:underline text-sm">&larr; Back</button>
                        <label htmlFor="profile-pic-upload" className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-5xl text-blue-700 shadow-lg mb-2 border-4 border-white cursor-pointer hover:bg-blue-300 transition">
                          <span role="img" aria-label="User">👤</span>
                        </label>
                        <input id="profile-pic-upload" type="file" accept="image/*" className="hidden" />
                        <form className="flex flex-col gap-2 w-full mt-2" onSubmit={e => {
                          e.preventDefault();
                          const form = e.target as HTMLFormElement;
                          const firstName = (form.elements[0] as HTMLInputElement).value.trim();
                          const middleName = (form.elements[1] as HTMLInputElement).value.trim();
                          const lastName = (form.elements[2] as HTMLInputElement).value.trim();
                          const age = (form.elements[3] as HTMLInputElement).value.trim();
                          const birthdate = (form.elements[4] as HTMLInputElement).value.trim();
                          const address = (form.elements[5] as HTMLInputElement).value.trim();
                          setProfile({ firstName, middleName, lastName, age, birthdate, address });
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('userProfile', JSON.stringify({ firstName, middleName, lastName, age, birthdate, address }));
                          }
                          setShowProfileEdit(false);
                        }}>
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <input required placeholder="First Name" className="flex-1 px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 min-w-0 text-blue-900 dark:text-blue-100 placeholder:text-blue-400 dark:placeholder:text-blue-300 bg-white dark:bg-[#23272f]" defaultValue={profile.firstName} />
                            <input required placeholder="Middle Name" className="flex-1 px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 min-w-0 text-blue-900 dark:text-blue-100 placeholder:text-blue-400 dark:placeholder:text-blue-300 bg-white dark:bg-[#23272f]" defaultValue={profile.middleName} />
                            <input required placeholder="Last Name" className="flex-1 px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 min-w-0 text-blue-900 dark:text-blue-100 placeholder:text-blue-400 dark:placeholder:text-blue-300 bg-white dark:bg-[#23272f]" defaultValue={profile.lastName} />
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <input type="number" min={0} placeholder="Age (optional)" className="flex-1 px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 min-w-0 text-blue-900 dark:text-blue-100 placeholder:text-blue-400 dark:placeholder:text-blue-300 bg-white dark:bg-[#23272f]" defaultValue={profile.age} />
                            <input type="date" placeholder="Birthdate (optional)" className="flex-1 px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 min-w-0 text-blue-900 dark:text-blue-100 placeholder:text-blue-400 dark:placeholder:text-blue-300 bg-white dark:bg-[#23272f]" defaultValue={profile.birthdate} />
                          </div>
                          <input placeholder="Address (optional)" className="px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 text-blue-900 dark:text-blue-100 placeholder:text-blue-400 dark:placeholder:text-blue-300 bg-white dark:bg-[#23272f]" defaultValue={profile.address} />
                          <Button type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition-all">Save Profile</Button>
                        </form>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 w-full mt-4">
                        <Button className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold rounded-xl shadow transition-all" variant="outline" onClick={() => setShowProfileEdit(true)}>My Profile</Button>
                        <Button className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold rounded-xl shadow transition-all" variant="outline" onClick={() => { setCurrentView('overallDashboard'); setShowProfileModal(false); }}>My Progress</Button>
                        <Button className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold rounded-xl shadow transition-all" variant="outline">Favorite Subject</Button>
                        <Button className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold rounded-xl shadow transition-all" variant="outline" onClick={() => {
                          setShowProfileModal(false);
                          setShowProfileEdit(false);
                          setIsCPASelected(false);
                          setCurrentView('home');
                          setSelectedFieldIdx(null);
                          setSelectedCourseIdx(null);
                        }}>Change Course</Button>
                        <Button className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow transition-all mt-2" variant="destructive">Sign Out</Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>
          );
        }
        return (
          <>
            <div
              className="min-h-[90vh] flex flex-col items-center justify-center px-2 py-6 pt-6 relative"
              style={{
                background: '#eaf4fb',
                color: '#181c24',
                transition: 'background 0.3s, color 0.3s'
              }}
            >
              {/* Logo */}
              <div className="flex flex-col items-center mb-6 mt-2">
                <Image
                  src="/logo/berq.png"
                  alt="Board Exam Review Questions Logo"
                  width={180}
                  height={80}
                  priority
                  className="mb-2"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
              {/* Field Dropdown */}
              <div className="w-full max-w-xs mb-4">
                <label className="block text-sm font-semibold text-blue-800 mb-1">Please select a field to begin</label>
                <select
                  className={`
                    w-full rounded-lg border-2 border-blue-200 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 shadow
                    bg-[#eaf4fb] text-blue-900
                    transition
                  `}
                  value={selectedFieldIdx === null ? '' : selectedFieldIdx}
                  onChange={e => { setSelectedFieldIdx(e.target.value === '' ? null : Number(e.target.value)); setSelectedCourseIdx(null); }}
                >
                  <option value="" disabled>Select field…</option>
                  {FIELDS.map((field, idx) => (
                    <option key={field.name} value={idx}>{field.icon} {field.name}</option>
                  ))}
                </select>
              </div>
              {/* Course Dropdown/List - only show if a field is selected */}
              {typeof selectedFieldIdx === 'number' && (
                <div className="w-full max-w-xs mb-6">
                  <label className="block text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">Select a course</label>
                  <select
                    className={`
                      w-full rounded-lg border-2 border-blue-200 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 shadow
                      bg-[#eaf4fb] text-blue-900
                      transition
                    `}
                    value={selectedCourseIdx ?? ''}
                    onChange={e => setSelectedCourseIdx(Number(e.target.value))}
                  >
                    <option value="" disabled>Select course…</option>
                    {FIELDS[selectedFieldIdx].courses.map((course, idx) => (
                      <option key={course.abbr} value={idx}>{course.abbr} - {course.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {/* Proceed Button */}
              <SpaceButton
                onClick={handleProceedAfterCourseSelection}
                disabled={selectedCourseIdx === null}
              />
              {/* Footer container */}
              <div className="w-full max-w-xs flex flex-col items-center mt-8 border-t border-gray-200 pt-4 gap-2">
                <button onClick={() => setShowGcashModal(true)} className="text-yellow-800 font-bold bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2 shadow hover:bg-yellow-200 hover:scale-105 transition-all duration-150 flex items-center gap-2">
                  <span className="text-2xl">☕</span> Buy Me a Coffee
                </button>
                <div className="flex flex-row items-center justify-center gap-4 mt-2">
                  <Link href="/guides" className="text-blue-700 hover:underline text-sm font-medium flex items-center gap-1">
                    <span>📖</span> Guides
                  </Link>
                  <Link href="/privacy" className="text-blue-700 hover:underline text-sm font-medium flex items-center gap-1">
                    <span>🔒</span> Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-blue-700 hover:underline text-sm font-medium flex items-center gap-1">
                    <span>📜</span> Terms of Use
                  </Link>
                </div>
                <div className="w-full text-center text-xs text-gray-500 mt-2">
                  All rights reserved Risoca © {new Date().getFullYear()}
                </div>
              </div>
            </div>
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
                    <img src="/Gcash/gcash.jpg" alt="GCash QR Code" className="w-48 h-48 object-contain rounded-xl" />
                    <span className="text-xs text-gray-500 mt-2">Scan with your GCash app</span>
                  </div>
                  <p className="text-center text-yellow-900 text-sm font-semibold">Thank you for your generosity and for supporting Filipino board exam takers! 💙</p>
                </div>
              </div>
            )}
          </>
        );
      case 'quiz':
        if (isLoading) {
          return (
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-10 w-1/3 mt-4" />
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
              onBack={handleBackToSubjects}
            />
          );
        } else {
          return (
            <div className="text-center p-10 bg-card rounded-lg shadow-lg">
              <Image src="https://placehold.co/300x200.png" alt="No questions loaded" data-ai-hint="study books" width={300} height={200} className="mx-auto mb-4 rounded-md" />
              <h2 className="text-2xl font-semibold mb-2 text-card-foreground">No Questions Loaded</h2>
              <p className="text-muted-foreground mb-4">Please select a subject to start.</p>
              <Button onClick={handleGoToSubjectsForQuiz} className="mr-2">Select Subject</Button>
              <Button onClick={handleGoHome} className="ml-2" variant="secondary">Back to Home</Button>
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
                <Button onClick={handleGoHome}>Back to Home</Button>
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
          {subjects.map((subject, idx) => (
            <Button
              key={subject.abbreviation}
              variant="outline"
              onClick={() => handleSubjectSelected(subject.abbreviation)}
              className={`
                flex flex-col items-center justify-center
                w-full h-20
                rounded-2xl border-2
                ${idx % 2 === 0 ? 'border-pink-300' : 'border-yellow-300'}
                bg-white/90
                shadow
                hover:bg-pink-50 hover:border-pink-400
                transition-all duration-200
                font-semibold text-blue-800
                text-base sm:text-lg
              `}
              style={{
                boxShadow: idx % 2 === 0
                  ? '0 4px 16px 0 rgba(255, 192, 203, 0.10)'
                  : '0 4px 16px 0 rgba(255, 255, 0, 0.10)'
              }}
            >
              <span className="font-bold text-xl sm:text-2xl text-center w-full">{subject.abbreviation}</span>
              <span className="text-sm sm:text-base text-blue-600 mt-1 text-center whitespace-normal w-full">{subject.fullName}</span>
            </Button>
          ))}
        </div>
        <div className="mt-10 flex justify-center w-full">
          <Button
            onClick={handleGoHome}
            variant="secondary"
            className="w-full h-12 bg-yellow-100 text-pink-600 font-bold rounded-xl hover:bg-yellow-200 transition text-lg"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
      case 'dashboard':
        if (isLoading) {
           return ( 
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="h-10 w-[300px] mb-6" />
              <Skeleton className="h-24 w-full max-w-md mb-4" />
              <Skeleton className="h-24 w-full max-w-md mb-4" />
              <Skeleton className="h-10 w-48" />
            </div>
           );
        }
        if (!questions || questions.length === 0 || !selectedSubject) {
          return (
            <div className="text-center p-10 bg-card rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-2 text-card-foreground">Dashboard Not Available</h2>
              <p className="text-muted-foreground mb-4">Please select a subject with questions to view its dashboard.</p>
              <Button onClick={handleGoToSubjectsForDashboard} className="mr-2">Select Subject</Button>
              <Button onClick={handleGoHome} variant="secondary">Back to Home</Button>
            </div>
          );
        }
        const subjectInfo = subjects.find(s => s.abbreviation === selectedSubject);
        return (
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-6 text-center text-foreground w-full">
              {subjectInfo ? subjectInfo.fullName : 'Subject Dashboard'}
            </h1>
            <SubjectDashboard
              questions={questions} 
              userAnswers={userAnswers} 
              subjectAbbreviation={selectedSubject} 
              onStartQuiz={async (subjectAbbr) => {
                setQuizSource('dashboard');
                if (!subjectAbbr) return;
                // Validate using the subjects array
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
                      setQuestions(subjectQuestions);
                      setCurrentQuestionIndex(0);
                      setQuizMode('quiz');
                   setCurrentView('quiz');
                      setSelectedSubject(subjectAbbr);
                } else {
                      toast({ title: "No Questions Found", description: `No questions found for ${subjectAbbr}.`, variant: "destructive" });
                    }
                  } else {
                    toast({ title: "Error", description: `Failed to load questions for ${subjectAbbr}.`, variant: "destructive" });
                }
                } catch (err) {
                  toast({ title: "Error", description: `Failed to load questions for ${subjectAbbr}.`, variant: "destructive" });
                } finally {
                  setIsLoading(false);
                }
              }}
              onBackToHome={handleGoHome}
              dark={theme === 'dark'}
            />
          </div>
        );
      case 'overallDashboard':
        // Aggregate stats from all subjects
        const allQuestions = subjects.flatMap(subject => {
          // This assumes you have a way to get all questions for each subject
          // If not, you may need to fetch or import them here
          // For now, just return [] as a placeholder
          return [];
        });
        const totalAnswered = validUserAnswers.length;
        const totalCorrect = validUserAnswers.filter(ans => ans.isCorrect).length;
        // Recommendations removed
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
                <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 drop-shadow text-center">Overall Dashboard</h2>
              </div>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 text-center max-w-2xl">See your overall progress, accuracy, and activity across all subjects. Use this dashboard to track your improvement and stay motivated!</p>
            </motion.div>
            {/* Stat Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full mb-8">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center min-h-[80px]">
                <span className="text-base sm:text-lg font-semibold text-blue-800 dark:text-blue-200 mb-1">Total Answered</span>
                <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-300">{totalAnswered}</span>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-800/40 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center min-h-[80px]">
                <span className="text-base sm:text-lg font-semibold text-green-800 dark:text-green-200 mb-1">Total Correct</span>
                <span className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-300">{totalCorrect}</span>
            </div>
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/40 dark:to-yellow-800/40 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center min-h-[80px]">
                <span className="text-base sm:text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Accuracy</span>
                <span className="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-300">{totalAnswered > 0 ? ((totalCorrect / totalAnswered) * 100).toFixed(1) : 0}%</span>
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
                      <RechartsTooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      {subjects.map(s => (
                        <Bar key={s.abbreviation} dataKey={s.abbreviation} stackId="a" fill={subjectColors[s.abbreviation] || '#8884d8'} />
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
                      <RechartsTooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      {subjects.map(s => (
                        <Bar key={s.abbreviation} dataKey={s.abbreviation} stackId="a" fill={subjectColors[s.abbreviation] || '#8884d8'} />
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
                  <RechartsTooltip />
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="questions" stroke="#f59e42" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
            <Button onClick={handleGoHome} variant="secondary" className="mt-8 w-full max-w-xs z-10">Back to Home</Button>
          </div>
        );
      default:
        return (
          <div className="text-center p-10">
            <h2 className="text-2xl">Page not found</h2>
            <Button onClick={handleGoHome}>Go Home</Button>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen w-full ${theme === 'dark' ? 'bg-[#181c24] text-white' : 'bg-[#eaf4fb] text-[#181c24]'}`}>
      <main className="w-full max-w-4xl mx-auto p-4 md:p-8 font-sans transition-all duration-500 ease-in-out">
        {renderContent()}
      </main>
      <Toaster />
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" height="200px" width="200px" viewBox="0 0 200 200" className="pencil">
            <defs>
              <clipPath id="pencil-eraser">
                <rect height={30} width={30} ry={5} rx={5} />
              </clipPath>
            </defs>
            <circle transform="rotate(-113,100,100)" strokeLinecap="round" strokeDashoffset="439.82" strokeDasharray="439.82 439.82" strokeWidth={2} stroke="currentColor" fill="none" r={70} className="pencil__stroke" />
            <g transform="translate(100,100)" className="pencil__rotate">
              <g fill="none">
                <circle transform="rotate(-90)" strokeDashoffset={402} strokeDasharray="402.12 402.12" strokeWidth={30} stroke="hsl(223,90%,50%)" r={64} className="pencil__body1" />
                <circle transform="rotate(-90)" strokeDashoffset={465} strokeDasharray="464.96 464.96" strokeWidth={10} stroke="hsl(223,90%,60%)" r={74} className="pencil__body2" />
                <circle transform="rotate(-90)" strokeDashoffset={339} strokeDasharray="339.29 339.29" strokeWidth={10} stroke="hsl(223,90%,40%)" r={54} className="pencil__body3" />
              </g>
              <g transform="rotate(-90) translate(49,0)" className="pencil__eraser">
                <g className="pencil__eraser-skew">
                  <rect height={30} width={30} ry={5} rx={5} fill="hsl(223,90%,70%)" />
                  <rect clipPath="url(#pencil-eraser)" height={30} width={5} fill="hsl(223,90%,60%)" />
                  <rect height={20} width={30} fill="hsl(223,10%,90%)" />
                  <rect height={20} width={15} fill="hsl(223,10%,70%)" />
                  <rect height={20} width={5} fill="hsl(223,10%,80%)" />
                  <rect height={2} width={30} y={6} fill="hsla(223,10%,10%,0.2)" />
                  <rect height={2} width={30} y={13} fill="hsla(223,10%,10%,0.2)" />
                </g>
              </g>
              <g transform="rotate(-90) translate(49,-30)" className="pencil__point">
                <polygon points="15 0,30 30,0 30" fill="hsl(33,90%,70%)" />
                <polygon points="15 0,6 30,0 30" fill="hsl(33,90%,50%)" />
                <polygon points="15 0,20 10,10 10" fill="hsl(223,10%,10%)" />
              </g>
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <ThemeProvider>
      <HomePageInner />
    </ThemeProvider>
  );
} 