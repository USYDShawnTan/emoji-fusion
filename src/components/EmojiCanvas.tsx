import React from 'react';

interface EmojiCanvasProps {
  emoji1: string;
  emoji2: string;
}

const EmojiCanvas: React.FC<EmojiCanvasProps> = ({ emoji1, emoji2 }) => {
  return (
    <div className="flex items-center justify-center h-64">
      <span className="text-9xl">{emoji1}{emoji2}</span>
    </div>
  );
};

export default EmojiCanvas;