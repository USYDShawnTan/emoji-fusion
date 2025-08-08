import React from 'react';
import EmojiPicker from './EmojiPicker';

interface EmojiSelectionSectionProps {
  selectedEmoji1: string;
  selectedEmoji2: string;
  onEmojiSelect1: (emoji: string) => void;
  onEmojiSelect2: (emoji: string) => void;
}

const EmojiSelectionSection: React.FC<EmojiSelectionSectionProps> = ({
  selectedEmoji1,
  selectedEmoji2,
  onEmojiSelect1,
  onEmojiSelect2
}) => {
  return (
    <div className="relative mb-8">
      {/* 选择区域 */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10">
        <div className="w-full max-w-[150px]">
          <EmojiPicker
            selectedEmoji={selectedEmoji1}
            onEmojiSelect={onEmojiSelect1}
          />
        </div>

        {/* 中间加号 - 优化显示效果 */}
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <span className="text-white text-lg font-medium">+</span>
          </div>
        </div>

        <div className="w-full max-w-[150px]">
          <EmojiPicker
            selectedEmoji={selectedEmoji2}
            onEmojiSelect={onEmojiSelect2}
          />
        </div>
      </div>
    </div>
  );
};

export default EmojiSelectionSection;
