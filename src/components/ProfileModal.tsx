import React from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full border-2 border-blue-100">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p className="mb-4">Welcome!</p>
        <p>Your profile details go here.</p>
        <button
          className="mt-6 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 w-full"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileModal; 