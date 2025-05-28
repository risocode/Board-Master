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
                <span className="text-3xl">🤝</span> 4. Third-Party Services
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">We use Google AdSense to display advertisements on our website. Google AdSense uses cookies to serve ads based on your prior visits to our website and other sites. You can opt out of personalized advertising by visiting Google&apos;s Ads Settings page.</p>
                <p className="text-lg leading-relaxed">Google AdSense may collect and process data according to their own privacy policy. We recommend reviewing Google&apos;s privacy policy for more information about how they handle your data.</p>
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
                <span className="text-3xl">🍪</span> 5. Cookies and Advertising
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">We use cookies for the following purposes:</p>
                <ul className="list-disc list-inside space-y-3 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl">
                  <li>Essential cookies for app functionality</li>
                  <li>Advertising cookies used by Google AdSense</li>
                  <li>Analytics cookies to improve our service</li>
                </ul>
                <p className="text-lg leading-relaxed">You can control cookie preferences through your browser settings. However, disabling certain cookies may affect the functionality of our website and the display of advertisements.</p>
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
                <span className="text-3xl">👤</span> 6. Your Rights
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">You have the right to:</p>
                <ul className="list-disc list-inside space-y-3 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl">
                  <li>Edit or delete your profile at any time</li>
                  <li>Clear your browser data to remove all stored information</li>
                  <li>Opt out of personalized advertising through Google&apos;s Ads Settings</li>
                  <li>Control cookie preferences through your browser settings</li>
                </ul>
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
                <span className="text-3xl">📝</span> 7. Changes to This Policy
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 pl-4">
                <p className="text-lg leading-relaxed">This policy may be updated. Changes will be posted on this page.</p>
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