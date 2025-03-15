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
    <div className="relative mb-10">
  
      
      {/* 选择区域 */}
      <div className="flex items-center justify-center gap-6 md:gap-10">
        <div className="w-[150px]">
          <EmojiPicker 
            selectedEmoji={selectedEmoji1} 
            onEmojiSelect={onEmojiSelect1}
            
          />
        </div>
        
        {/* 中间加号 - 带动画效果 */}
        <div className="relative pt-10 px-4">
          <div className="backdrop-blur-sm rounded-full flex items-center justify-center ">
          </div>
         
            <span className="text-2xl text-white">+</span>
         
        </div>
        
        <div className="w-[150px]">
          <EmojiPicker 
            selectedEmoji={selectedEmoji2} 
            onEmojiSelect={onEmojiSelect2}
            
          />
        </div>
      </div>
      
      {/* 这里已移除装饰性连接线 */}
    </div>
  );
};

export default EmojiSelectionSection;
