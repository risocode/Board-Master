"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/common/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#181c24] text-white' : 'bg-[#eaf4fb] text-[#181c24]'}`}>
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl" />
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
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
          <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400">
            Privacy Policy
          </h1>
          
          <div className="space-y-12">
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-green-500 to-teal-500 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-green-600 dark:text-green-400 flex items-center gap-3">
                <span className="text-3xl">📋</span> 1. Information We Collect
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">All information you provide (profile, quiz progress, answers, preferences) is stored locally in your browser. No information is sent to any server or third party.</p>
                <ul className="list-disc list-inside space-y-3 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl">
                  <li>Your profile (name, middle name, last name, age, birthdate, address)</li>
                  <li>Quiz progress, answers, and statistics</li>
                  <li>Theme and UI preferences</li>
                </ul>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-teal-500 to-green-500 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-teal-600 dark:text-teal-400 flex items-center gap-3">
                <span className="text-3xl">🎯</span> 2. How We Use Your Information
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">Your data is used only to personalize your experience, track your quiz progress, and remember your preferences. No data is shared or sold.</p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-green-500 to-teal-500 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-green-600 dark:text-green-400 flex items-center gap-3">
                <span className="text-3xl">🔒</span> 3. Data Storage and Security
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">All data is stored in your browser's localStorage. No data is transmitted to any server. If you clear your browser data, your profile and progress will be lost.</p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-teal-500 to-green-500 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-teal-600 dark:text-teal-400 flex items-center gap-3">
                <span className="text-3xl">🤝</span> 4. Third-Party Services
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">No third-party analytics, ads, or authentication are used. No information is shared with any external service.</p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-green-500 to-teal-500 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-green-600 dark:text-green-400 flex items-center gap-3">
                <span className="text-3xl">👤</span> 5. Your Rights
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">You can edit or delete your profile at any time. You can clear your browser data to remove all stored information.</p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-teal-500 to-green-500 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-teal-600 dark:text-teal-400 flex items-center gap-3">
                <span className="text-3xl">🍪</span> 6. Cookies
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">No cookies are used. All data is stored in localStorage.</p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-green-500 to-teal-500 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-green-600 dark:text-green-400 flex items-center gap-3">
                <span className="text-3xl">📝</span> 7. Changes to This Policy
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">This policy may be updated. Changes will be posted on this page.</p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="relative"
            >
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-teal-500 to-green-500 rounded-full" />
              <h2 className="text-2xl font-semibold mb-6 text-teal-600 dark:text-teal-400 flex items-center gap-3">
                <span className="text-3xl">📧</span> 8. Contact Us
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">If you have any questions about this Privacy Policy, please use the contact link in the app.</p>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 