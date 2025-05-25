"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SpaceButton from '../components/common/SpaceButton';
import { ThemeProvider } from '../components/common/ThemeContext';
import MaintenanceModal from '../components/common/MaintenanceModal';

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
      { abbr: 'BSN-ND', name: 'Nutrition and Dietetics' },
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

function HomePage() {
  const router = useRouter();
  const [selectedFieldIdx, setSelectedFieldIdx] = useState<number | null>(null);
  const [selectedCourseIdx, setSelectedCourseIdx] = useState<number | null>(null);
  const [showMaintenance, setShowMaintenance] = useState(false);

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
    // Route to the dynamic course page using the course abbreviation (use only the first part if abbr has a slash)
    const courseType = selectedCourse.abbr.split('/')[0];
    
    // Check if the course is CPA or BSA
    if (courseType === 'CPA' || courseType === 'BSA') {
      router.push(`/course/${courseType}`);
    } else {
      setShowMaintenance(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#eaf4fb] text-[#181c24] flex flex-col items-center justify-center">
      <MaintenanceModal open={showMaintenance} onClose={() => setShowMaintenance(false)} courseName={selectedCourseName} />
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
      <div className="w-full max-w-xs mb-4">
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
      {/* Footer container */}
      <div className="w-full max-w-xs flex flex-col items-center mt-8 border-t border-gray-200 pt-4 gap-2">
        <button className="text-yellow-800 font-bold bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2 shadow hover:bg-yellow-200 hover:scale-105 transition-all duration-150 flex items-center gap-2">
          <span className="text-2xl">☕</span> Buy Me a Coffee
        </button>
        <div className="flex flex-row items-center justify-center gap-x-8 w-full mt-2 whitespace-nowrap">
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
  );
}

export default function HomePageWrapper() {
  return (
    <ThemeProvider>
      <HomePage />
    </ThemeProvider>
  );
} 