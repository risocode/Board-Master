"use client";

import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SpaceButton from '../components/common/SpaceButton';
import { ThemeProvider, useTheme } from '../components/common/ThemeContext';
import MaintenanceModal from '../components/common/MaintenanceModal';
import { getProfessionalTitleAndWelcome } from '@/data/professionalTitles';

const FIELDS = [
  {
    icon: '🩺',
    name: 'Health And Allied Sciences',
    courses: [
      { abbr: 'BSN', name: 'Bachelor of Science in Nursing' },
      { abbr: 'BSP', name: 'Bachelor of Science in Pharmacy' },
      { abbr: 'BSMT/BSMLS', name: 'Medical Technology / Medical Laboratory Science' },
      { abbr: 'BSPT', name: 'Physical Therapy' },
      { abbr: 'BSOT', name: 'Occupational Therapy' },
      { abbr: 'DMD', name: 'Doctor of Dental Medicine' },
      { abbr: 'BSM', name: 'Midwifery' },
      { abbr: 'BSRT', name: 'Radiologic Technology' },
      { abbr: 'BSN-ND', name: 'Nutrition and Dietetics' },
      { abbr: 'BSSLP', name: 'Speech-Language Pathology' },
      { abbr: 'BSRespT', name: 'Respiratory Therapy' },
      { abbr: 'BSOA', name: 'Optometry' },
    ],
  },
  {
    icon: '⚖️',
    name: 'Law And Criminology',
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
    name: 'Business And Accountancy',
    courses: [
      { abbr: 'BSA', name: 'Accountancy' },
      { abbr: 'BSCA', name: 'Customs Administration' },
      { abbr: 'BSREM', name: 'Real Estate Management' },
    ],
  },
  {
    icon: '🛠️',
    name: 'Architecture And Design',
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

// Utility functions for slugification
function slugify(str: string) {
  return str.replace(/\s+/g, '-');
}

function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [selectedFieldIdx, setSelectedFieldIdx] = useState<number | null>(null);
  const [selectedCourseIdx, setSelectedCourseIdx] = useState<number | null>(null);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [showGcashModal, setShowGcashModal] = useState(false);

  // Get the selected course name for the modal
  let selectedCourseName: string | undefined = undefined;
  if (
    typeof selectedFieldIdx === 'number' &&
    typeof selectedCourseIdx === 'number' &&
    FIELDS[selectedFieldIdx] &&
    FIELDS[selectedFieldIdx].courses[selectedCourseIdx]
  ) {
    selectedCourseName = FIELDS[selectedFieldIdx].courses[selectedCourseIdx].name;
  }

  const handleProceed = () => {
    if (selectedFieldIdx === null || selectedCourseIdx === null) return;
    const selectedField = FIELDS[selectedFieldIdx];
    const selectedCourse = selectedField.courses[selectedCourseIdx];
    const courseType = selectedCourse.abbr.split('/')[0];
    const redirectUrl = `/course/${courseType}`;
    router.push(redirectUrl);
  };

  return (
    <div className="min-h-screen w-full bg-[#eaf4fb] text-[#181c24] flex flex-col items-center justify-center">
      <MaintenanceModal
        open={showMaintenance}
        onClose={() => setShowMaintenance(false)}
        courseName={selectedCourseName}
        message={
          selectedCourseName
            ? `${selectedCourseName} is under construction.`
            : 'This course is under construction.'
        }
        onChangeCourse={() => {
          setShowMaintenance(false);
          setSelectedFieldIdx(null);
          setSelectedCourseIdx(null);
        }}
      />
      <div className="flex flex-col items-center mb-6 mt-2">
        <Image
          src={theme === 'dark' ? '/logo/berq-g.png' : '/logo/berq-b.png'}
          alt="Board Exam Review Questions Logo"
          width={340}
          height={100}
          priority
          className="mb-2"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <div className="w-full max-w-xs mb-3">
        <label className="block text-sm font-semibold text-blue-800 mb-1">Please select a field to begin</label>
        <select
          className="w-full rounded-lg border-2 border-blue-200 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 shadow bg-[#eaf4fb] text-blue-900 transition"
          value={selectedFieldIdx === null ? '' : selectedFieldIdx}
          onChange={e => { setSelectedFieldIdx(e.target.value === '' ? null : Number(e.target.value)); setSelectedCourseIdx(null); }}
        >
          <option value="" disabled>Select field…</option>
          {FIELDS.map((field, idx) => (
            <option key={field.name} value={idx}>{field.icon} {field.name}</option>
          ))}
        </select>
      </div>
      {typeof selectedFieldIdx === 'number' && (
        <div className="w-full max-w-xs mb-6">
          <label className="block text-sm font-semibold text-blue-800 mb-1">Select a course</label>
          <select
            className="w-full rounded-lg border-2 border-blue-200 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 shadow bg-[#eaf4fb] text-blue-900 transition"
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
      <SpaceButton
        label="PROCEED"
        onClick={handleProceed}
        disabled={selectedFieldIdx === null || selectedCourseIdx === null}
      />
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
      <div className="flex flex-col items-center w-full mt-2">
        <button
          onClick={() => setShowGcashModal(true)}
          className="bg-yellow-100 border border-yellow-300 rounded-xl shadow flex items-center justify-center px-4 py-3 my-3 transition hover:bg-yellow-200 cursor-pointer hover:scale-105 mx-auto"
          style={{ maxWidth: 320 }}
        >
          <span className="text-2xl mr-2 animate-bounce">☕</span>
          <span className="font-bold text-yellow-900 text-lg sm:text-xl">Buy Me a Coffee</span>
        </button>
        <div className="flex flex-row items-center justify-center gap-x-8 w-full whitespace-nowrap">
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
      </div>
      <div className="w-full text-center text-xs text-gray-500 mt-2">
        All rights reserved Risoca © {new Date().getFullYear()}
      </div>
    </div>
  );
}

export default function HomePageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider>
        <HomePage />
      </ThemeProvider>
    </Suspense>
  );
} 