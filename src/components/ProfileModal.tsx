import React, { useState, useEffect } from 'react';
import { getProfessionalTitleAndWelcome } from '@/data/professionalTitles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser, useClerk } from '@clerk/nextjs';
import Image from 'next/image';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseType?: string;
  middleName: string;
  setMiddleName: (val: string) => void;
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
}

// Helper to capitalize first letter and lowercase the rest
function formatNamePart(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  courseType = 'BSA',
  middleName,
  setMiddleName,
  firstName,
  setFirstName,
  lastName,
  setLastName,
}) => {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Load Clerk profile image if available
  useEffect(() => {
    if (user && user.imageUrl) {
      setProfileImage(user.imageUrl);
    } else {
      setProfileImage(null);
    }
  }, [user]);

  if (!isOpen) return null;

  const { title } = getProfessionalTitleAndWelcome(courseType);
  
  const formatFullName = () => {
    const parts = [firstName, middleName, lastName].map(formatNamePart).filter(Boolean);
    if (!parts.length) return '';
    if (title === 'CPA' || title === 'LPT') {
      return `${parts.join(' ')}${title ? `, ${title}` : ''}`;
    } else if (title) {
      return `${title} ${parts.join(' ')}`;
    }
    return parts.join(' ');
  };

  // Helper to get display name
  const displayName = user?.fullName || [firstName, middleName, lastName].filter(Boolean).join(' ');
  const displayEmail = user?.primaryEmailAddress?.emailAddress || '';

  const handleSave = async () => {
    try {
      const formattedFirst = formatNamePart(firstName);
      const formattedMiddle = formatNamePart(middleName);
      const formattedLast = formatNamePart(lastName);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userFirstName', formattedFirst);
        localStorage.setItem('userMiddleName', formattedMiddle);
        localStorage.setItem('userLastName', formattedLast);
      }
      setFirstName(formattedFirst);
      setMiddleName(formattedMiddle);
      setLastName(formattedLast);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full border-2 border-blue-100 flex flex-col items-center relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-500 text-3xl font-bold transition-all"
          aria-label="Close"
        >
          &times;
        </button>
        {/* Profile image and name above name fields */}
        <div className="flex flex-col items-center mb-4">
          {profileImage ? (
            <Image src={profileImage} alt="Profile" width={80} height={80} className="w-20 h-20 rounded-full border-2 border-blue-200 mb-2 object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full border-2 border-blue-200 mb-2 bg-gray-200 flex items-center justify-center text-3xl text-gray-400">
              <span>👤</span>
            </div>
          )}
          {/* Name directly below the image */}
          {!isEditing && (
            <>
              <div className="font-bold text-xl text-blue-900 text-center">{displayName}</div>
              {displayEmail && <div className="text-sm text-gray-600 text-center">{displayEmail}</div>}
            </>
          )}
        </div>
        {isEditing ? (
          <div className="w-full space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(formatNamePart(e.target.value))}
                placeholder="First Name"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Middle Name</label>
              <Input
                value={middleName}
                onChange={(e) => setMiddleName(formatNamePart(e.target.value))}
                placeholder="Middle Name"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(formatNamePart(e.target.value))}
                placeholder="Last Name"
                className="w-full"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)} className="w-full mb-2 bg-pink-200 text-pink-900 font-bold">
              Edit Name
            </Button>
            <Button
              onClick={() => openUserProfile()}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-pink-400 text-white font-bold text-base shadow-lg hover:from-pink-500 hover:to-blue-400 transition-all text-center"
            >
              Manage Profile
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileModal; 