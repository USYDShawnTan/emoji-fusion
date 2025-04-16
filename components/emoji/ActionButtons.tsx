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
  const isLoading = loading || isFakeLoading;
  
  return (
    <div className="space-y-10">
      {/* 随机合成按钮 */}
      <div className="flex justify-center relative">
        {/* 光环效果 */}
        <div 
          className={`absolute w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/40 to-white-500/40 blur-lg
                      ${isRandomHovered ? 'opacity-80' : 'opacity-0'}`}
          style={{transform: 'scale(1.3)'}}
        ></div>
        
        {/* 按钮 */}
        <button
          onClick={onRandomFusion}
          onMouseEnter={() => onRandomHoverChange(true)}
          onMouseLeave={() => onRandomHoverChange(false)}
          disabled={isLoading}
          className={`
            relative z-10 p-4 rounded-full 
            transition-all duration-300 ease-out
            bg-gradient-to-r shadow-lg shadow-accent-500/20
            text-white overflow-hidden group
            ${isLoading
              ? "bg-gradient-to-r from-accent-500 to-pink-500 hover:from-accent-400 hover:to-pink-400"
              : "bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-400 hover:to-primary-400"}
          `}
          style={{ 
            transform: isRandomHovered && !isLoading ? "scale(1.15)" : "scale(1)",
          }}
        >
          {/* 闪光效果 */}
          <span 
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/40 to-white/0 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform 
                       -translate-x-full group-hover:translate-x-full"
            style={{ transitionDuration: '1.5s' }}
          ></span>
          
          <div className="relative flex items-center justify-center">
            <img
              src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f3b2/512.gif"
              alt="随机emoji"
              className={`w-7 h-7 ${isLoading ? 'animate-spin' : ''}`}
            />
          </div>
          
          {/* 工具提示 */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md shadow-md text-xs text-primary-700 font-medium whitespace-nowrap">
              随机组合
            </div>
          </div>
        </button>
      </div>
      
      {/* 合成/清除按钮 */}
      <div className="flex justify-center items-center">
        <div className="relative">
          {/* 按钮底部的渐变光效已移除 */}
          
          <button 
            onClick={onManualAction}
            disabled={!canPerformAction}
            className={`
              py-3.5 px-8 rounded-full text-lg font-bold flex items-center justify-center
              transition-all duration-300 w-52 relative overflow-hidden
              shadow-lg backdrop-blur-sm border border-white/20
              ${canPerformAction
                ? hasResult 
                  ? "bg-gradient-to-r from-secondary-500/80 to-secondary-600/80 hover:from-secondary-400/80 hover:to-secondary-500/80 text-white" 
                  : "bg-gradient-to-r from-primary-500/80 to-primary-600/80 hover:from-primary-400/80 hover:to-primary-500/80 text-white"
                : "bg-gray-500/30 backdrop-blur-sm text-gray-300/50 cursor-not-allowed"}
            `}
          >
            {/* 闪光效果 */}
            {canPerformAction && (
              <span 
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 
                         opacity-0 hover:opacity-100 transition-all duration-1000 transform 
                         -translate-x-full hover:translate-x-full"
              ></span>
            )}
            
            <span className="relative z-10 flex items-center">
              {isLoading ? (
                <>
                  <div className="relative mr-3">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <span className="animate-pulse-slow">魔法融合中...</span>
                </>
              ) : hasResult ? (
                <>
                  <span className="mr-2">🧹</span>
                  清除结果
                </>
              ) : (
                <>
                  <span className="mr-2 animate-pulse-slow">✨</span>
                  开始融合
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;
