"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/common/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#181c24] text-white' : 'bg-[#eaf4fb] text-[#181c24]'}`}>
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
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
              src={theme === 'dark' ? '/logo/berq-g.png' : '/logo/berq-b.png'}
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
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
          <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
            Terms of Use
          </h1>
          
          <div className="space-y-12">
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-purple-600 dark:text-purple-400 flex items-center gap-3">
                <span className="text-3xl">📜</span> 1. Acceptance of Terms
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">By using BoardMaster, you agree to these terms. If you do not agree, do not use the app.</p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400 flex items-center gap-3">
                <span className="text-3xl">🔒</span> 2. Use License
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">You may use BoardMaster for personal, non-commercial purposes only. You may not copy, modify, or redistribute the app or its content.</p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-purple-600 dark:text-purple-400 flex items-center gap-3">
                <span className="text-3xl">👤</span> 3. User Account & Data
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">No server-side accounts are created. Your profile and quiz data are stored locally in your browser. You are responsible for your own device and browser data.</p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400 flex items-center gap-3">
                <span className="text-3xl">⚠️</span> 4. Disclaimer
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">The app is provided "as is" without warranties. Quiz content is for educational purposes only.</p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-purple-600 dark:text-purple-400 flex items-center gap-3">
                <span className="text-3xl">⚖️</span> 5. Limitations
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">The app creators are not liable for any damages or data loss. Use at your own risk.</p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400 flex items-center gap-3">
                <span className="text-3xl">📝</span> 6. Revisions
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">These terms may be updated at any time. Changes will be posted on this page.</p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-purple-600 dark:text-purple-400 flex items-center gap-3">
                <span className="text-3xl">🌍</span> 7. Governing Law
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">These terms are governed by the laws of the Philippines.</p>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 