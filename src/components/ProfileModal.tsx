import React from 'react';
import SignUpForm from './SignUpForm';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GoogleSignInButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center gap-3 w-full max-w-xs mx-auto mt-6 py-3 px-6 rounded-full text-lg font-semibold bg-[#ea4335] text-white shadow-lg hover:bg-[#d93025] transition-colors"
    style={{ boxShadow: '0 4px 24px 0 rgba(234,67,53,0.15)' }}
  >
    <span style={{ background: '#fff', borderRadius: '50%', padding: 2, display: 'flex', alignItems: 'center' }}>
      <svg width="28" height="28" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303C34.89 32.438 29.92 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c2.69 0 5.164.896 7.163 2.385l6.084-6.084C33.527 6.053 28.97 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.138-2.651-.389-3.917z"/><path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.655 16.108 19.01 13 24 13c2.69 0 5.164.896 7.163 2.385l6.084-6.084C33.527 6.053 28.97 4 24 4c-7.732 0-14.41 4.388-17.694 10.691z"/><path fill="#FBBC05" d="M24 44c5.798 0 10.62-1.93 14.163-5.242l-6.522-5.357C29.92 36 24 36 24 36c-5.92 0-10.89-3.562-13.303-8.917l-6.571 5.081C9.59 39.612 16.268 44 24 44z"/><path fill="#EA4335" d="M43.611 20.083H42V20H24v8h11.303C34.89 32.438 29.92 36 24 36c-5.92 0-10.89-3.562-13.303-8.917l-6.571 5.081C9.59 39.612 16.268 44 24 44c11.046 0 20-8.954 20-20 0-1.341-.138-2.651-.389-3.917z"/></g></svg>
    </span>
    Sign in with Google
  </button>
);

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const isLoggedIn = false; // Replace with your actual login check logic

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full border-2 border-blue-100">
        {isLoggedIn ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p className="mb-4">Welcome back!</p>
            <p>Your profile details go here.</p>
          </>
        ) : (
          <SignUpForm />
        )}
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