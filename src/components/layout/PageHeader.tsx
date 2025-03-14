import React from 'react';

const PageHeader: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold text-white drop-shadow-lg">Emoji Fusion</h1>
      <p className="text-lg text-gray-200 mt-2">创建你独特的emoji组合!</p>
    </header>
  );
};

export default PageHeader;