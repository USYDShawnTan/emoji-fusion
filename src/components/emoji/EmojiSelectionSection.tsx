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
    <div className="flex items-center justify-center gap-12 mb-8">
      <div className="w-[170px]">
        <EmojiPicker 
          selectedEmoji={selectedEmoji1} 
          onEmojiSelect={onEmojiSelect1}
          label="第一个Emoji"
        />
      </div>
      <span className="text-4xl mt-6">➕</span>
      <div className="w-[170px]">
        <EmojiPicker 
          selectedEmoji={selectedEmoji2} 
          onEmojiSelect={onEmojiSelect2}
          label="第二个Emoji"
        />
      </div>
    </div>
  );
};

export default EmojiSelectionSection;