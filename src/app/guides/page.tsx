"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/common/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GuidesPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#181c24] text-white' : 'bg-[#eaf4fb] text-[#181c24]'}`}>
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/logo/berq.png"
              alt="Board Exam Review Questions Logo"
              width={120}
              height={50}
              priority
              className="mb-2"
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
          <Button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Back
          </Button>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 dark:bg-[#23272f]/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-10 border border-white/20"
        >
          <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600">
            User Guides
          </h1>
          
          <div className="space-y-12">
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400 flex items-center gap-3">
                <span className="text-3xl">🚀</span> Getting Started
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg">Welcome to BoardMaster! Here&apos;s how to get started:</p>
                <ol className="list-decimal list-inside space-y-3">
                  <li className="hover:translate-x-2 transition-transform">Select your field of study from the dropdown menu</li>
                  <li className="hover:translate-x-2 transition-transform">Choose your specific course</li>
                  <li className="hover:translate-x-2 transition-transform">Sign in with your Google account</li>
                  <li className="hover:translate-x-2 transition-transform">Start taking quizzes and track your progress</li>
                </ol>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-pink-500 to-pink-600 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-pink-600 dark:text-pink-400 flex items-center gap-3">
                <span className="text-3xl">✨</span> Features Guide
              </h2>
              <div className="space-y-6 text-gray-700 dark:text-gray-300 pl-4">
                <div className="bg-gradient-to-r from-blue-50 to-pink-50 dark:from-blue-900/20 dark:to-pink-900/20 p-6 rounded-xl">
                  <h3 className="text-xl font-medium text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📝</span> Quiz Mode
                  </h3>
                  <ul className="list-disc list-inside space-y-3">
                    <li className="hover:translate-x-2 transition-transform">Select subjects to practice</li>
                    <li className="hover:translate-x-2 transition-transform">Answer questions one by one</li>
                    <li className="hover:translate-x-2 transition-transform">Review your answers after completion</li>
                    <li className="hover:translate-x-2 transition-transform">Track your progress over time</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-blue-50 dark:from-pink-900/20 dark:to-blue-900/20 p-6 rounded-xl">
                  <h3 className="text-xl font-medium text-pink-600 dark:text-pink-400 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📊</span> Dashboard
                  </h3>
                  <ul className="list-disc list-inside space-y-3">
                    <li className="hover:translate-x-2 transition-transform">View subject-specific performance</li>
                    <li className="hover:translate-x-2 transition-transform">Track daily and monthly progress</li>
                    <li className="hover:translate-x-2 transition-transform">Analyze your strengths and weaknesses</li>
                    <li className="hover:translate-x-2 transition-transform">Monitor your improvement over time</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-yellow-600 dark:text-yellow-400 flex items-center gap-3">
                <span className="text-3xl">💡</span> Tips for Success
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <ul className="list-disc list-inside space-y-3">
                  <li className="hover:translate-x-2 transition-transform">Practice regularly with different subjects</li>
                  <li className="hover:translate-x-2 transition-transform">Review incorrect answers to learn from mistakes</li>
                  <li className="hover:translate-x-2 transition-transform">Use the dashboard to identify areas needing improvement</li>
                  <li className="hover:translate-x-2 transition-transform">Take advantage of the review mode to reinforce learning</li>
                </ul>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 