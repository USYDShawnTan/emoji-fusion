import React from 'react';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import EmojiQuantumField from './EmojiQuantumField';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/40 via-purple-800/30 to-pink-900/40 py-8 relative overflow-hidden">
      {/* 量子背景场 */}
      <EmojiQuantumField />
      
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <PageHeader />
        
        {children}
        
        <PageFooter />
      </div>
    </div>
  );
};

export default PageLayout;