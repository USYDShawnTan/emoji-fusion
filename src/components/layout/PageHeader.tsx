import React from 'react';

const PageHeader: React.FC = () => {
  return (
    <header className="text-center mb-12 relative py-6">
      {/* 装饰性顶部元素 */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-secondary-400 via-primary-400 to-accent-400 rounded-full opacity-70"></div>
      
      {/* 现代化标题 */}
      <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary-300 via-white to-primary-300 drop-shadow-sm relative animate-pulse-slow">
        Emoji Fusion
        <span className="absolute -top-3 -right-6 text-xl animate-float">✨</span>
      </h1>
      
      <p className="text-xl text-white/90 mt-3 font-light tracking-wide">
        创造<span className="text-secondary-300 font-normal">独特</span>的表情组合
      </p>
      
      {/* 背景装饰 */}
      <div className="absolute -top-4 -left-12 text-5xl opacity-10 rotate-12 hidden md:block">
        <span className="text-white">🌟</span>
      </div>
      <div className="absolute -top-2 -right-8 text-4xl opacity-10 -rotate-12 hidden md:block">
        <span className="text-white">✨</span>
      </div>
    </header>
  );
};

export default PageHeader;
