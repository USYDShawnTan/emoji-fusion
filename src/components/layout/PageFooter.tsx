import React from 'react';

const PageFooter: React.FC = () => {
  return (
    <footer className="text-center text-gray-300 text-sm mt-8">
      Emoji Fusion &copy; {new Date().getFullYear()}
    </footer>
  );
};

export default PageFooter;