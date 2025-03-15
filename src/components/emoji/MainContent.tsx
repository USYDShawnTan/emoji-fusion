import React from 'react';
import EmojiSelectionSection from './EmojiSelectionSection';
import ActionButtons from './ActionButtons';
import FusionResult from './FusionResult';

interface MainContentProps {
  selectedEmoji1: string;
  selectedEmoji2: string;
  onEmojiSelect1: (emoji: string) => void;
  onEmojiSelect2: (emoji: string) => void;
  loading: boolean;
  isFakeLoading: boolean;
  error: Error | null;
  fusionResult: { url: string } | null;
  isRandomHovered: boolean;
  hasResult: boolean;
  canPerformAction: boolean;
  onRandomFusion: () => void;
  onManualAction: () => void;
  onRandomHoverChange: (isHovered: boolean) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  selectedEmoji1,
  selectedEmoji2,
  onEmojiSelect1,
  onEmojiSelect2,
  loading,
  isFakeLoading,
  error,
  fusionResult,
  isRandomHovered,
  hasResult,
  canPerformAction,
  onRandomFusion,
  onManualAction,
  onRandomHoverChange
}) => {
  return (
    <div className="space-y-12">
      {/* 主要内容 - 玻璃态效果 */}
      <div 
        className="backdrop-blur-xl bg-white/20 rounded-2xl shadow-glass p-6 md:p-8 border border-white/30 
                  transition-all duration-500 hover:bg-white/25 relative overflow-hidden"
      >
        {/* 装饰性角标 */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-primary-500/40 to-secondary-500/40 rounded-full blur-lg"></div>
        
        {/* 光效装饰 */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        
        <div className="relative z-10">
          <EmojiSelectionSection
            selectedEmoji1={selectedEmoji1}
            selectedEmoji2={selectedEmoji2}
            onEmojiSelect1={onEmojiSelect1}
            onEmojiSelect2={onEmojiSelect2}
          />
          
          <ActionButtons 
            loading={loading}
            isFakeLoading={isFakeLoading}
            isRandomHovered={isRandomHovered}
            hasResult={hasResult}
            canPerformAction={canPerformAction}
            onRandomFusion={onRandomFusion}
            onManualAction={onManualAction}
            onRandomHoverChange={onRandomHoverChange}
          />
        </div>
      </div>
      
      {/* 结果部分 */}
      <div 
        className="backdrop-blur-xl bg-white/20 rounded-2xl shadow-glass p-6 md:p-8 border border-white/30 
                  transition-all duration-500 hover:bg-white/25 relative overflow-hidden"
      >
        {/* 装饰性角标 */}
        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-gradient-to-br from-accent-500/40 to-primary-500/40 rounded-full blur-lg"></div>
        
       
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-300 via-white to-secondary-300">
            <span className="inline-block mr-2">✨</span>
            合成结果
            <span className="inline-block ml-2">✨</span>
          </h2>
          
          <FusionResult 
            loading={loading || isFakeLoading}
            error={error}
            result={fusionResult}
          />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
