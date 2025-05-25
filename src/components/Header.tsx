import type React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-4xl flex items-center justify-between py-4 px-2 md:px-0 mb-6 border-b-2 border-[hsl(var(--border))]">
      <h1 className="text-3xl md:text-4xl font-bold text-[hsl(var(--primary-foreground))]">
        CPA Review
      </h1>
    </header>
  );
};

export default Header;
