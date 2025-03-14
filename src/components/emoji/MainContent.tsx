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
  error: Error | null;  // 修改为 Error | null
  fusionResult: { url: string } | null;  // 修改为 { url: string } | null
  isRandomHovered: boolean;
  hasResult: boolean;  // 修改为 boolean
  canPerformAction: boolean;  // 修改为 boolean
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
    <>
      {/* 主要内容 - 带背景模糊效果 */}
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-8">
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
      
      {/* 结果部分 */}
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">合成结果</h2>
        <FusionResult 
          loading={loading || isFakeLoading}
          error={error}
          result={fusionResult}
        />
      </div>
    </>
  );
};

export default MainContent;