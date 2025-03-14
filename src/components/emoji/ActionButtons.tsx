import React from 'react';

interface ActionButtonsProps {
  loading: boolean;
  isFakeLoading: boolean;
  isRandomHovered: boolean;
  hasResult: boolean;
  canPerformAction: boolean;
  onRandomFusion: () => void;
  onManualAction: () => void;
  onRandomHoverChange: (isHovered: boolean) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  loading,
  isFakeLoading,
  isRandomHovered,
  hasResult,
  canPerformAction,
  onRandomFusion,
  onManualAction,
  onRandomHoverChange
}) => {
  return (
    <>
      {/* 随机合成按钮 */}
      <div className="flex justify-center mb-6 relative">
        <button
          onClick={onRandomFusion}
          onMouseEnter={() => onRandomHoverChange(true)}
          onMouseLeave={() => onRandomHoverChange(false)}
          style={{ transform: isRandomHovered ? "scale(1.2)" : "scale(1)" }}
          className={`p-3 rounded-full transition-all duration-300 ${
            loading || isFakeLoading
              ? 'bg-blue-400' // 轻微降低亮度，但不禁用
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          <img
            src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f3b2/512.gif"
            alt="随机emoji"
            className={`w-6 h-6 ${(loading || isFakeLoading) ? 'animate-pulse' : ''}`}
          />
        </button>
      </div>
      
      {/* 合成/清除按钮 */}
      <div className="flex justify-center items-center mt-8">
        <button 
          onClick={onManualAction}
          disabled={!canPerformAction}
          className={`
            py-3 px-8 rounded-full text-lg font-bold flex items-center justify-center
            transition-all duration-200 w-48 transform hover:scale-[1.1]
            ${canPerformAction
              ? hasResult 
                ? "bg-red-500 hover:bg-red-600 text-white shadow-md" 
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"}
          `}
        >
          {loading || isFakeLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              🌟 合成中~
            </>
          ) : hasResult ? (
            <>
              🧹 清除结果
            </>
          ) : (
            <>
              🌟 emoji合成
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default ActionButtons;