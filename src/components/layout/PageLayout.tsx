import React from 'react';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import EmojiQuantumField from './EmojiQuantumField';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800/70 via-secondary-700/60 to-primary-600/70 py-12 relative overflow-hidden">
      {/* 装饰元素 - 左上角 */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-accent-500/20 rounded-full blur-3xl"></div>
      
      {/* 装饰元素 - 右下角 */}
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary-500/20 rounded-full blur-3xl"></div>
      
      {/* 量子背景场 */}
      <EmojiQuantumField />
      
      {/* 内容容器 */}
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <PageHeader />
        
        <div className="transition-all duration-500 ease-in-out">
          {children}
        </div>
        
        <PageFooter />
      </div>
    </div>
  );
};

export default PageLayout;
