import React, { useState, useEffect } from 'react';

interface FusionResultProps {
  loading: boolean;
  error: Error | null;
  result: { url: string } | null;
}

const FusionResult: React.FC<FusionResultProps> = ({ loading, error, result }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [showImage, setShowImage] = useState(false);
  
  // 当result变化时，重置状态
  useEffect(() => {
    if (result) {
      setImageLoading(true);
      setShowImage(false);
      // 添加小延迟以实现更好的动画效果
      setTimeout(() => setShowImage(true), 100);
    }
  }, [result?.url]);

  // 检查错误类型
  const isNotFoundError = error?.message?.includes('这两个Emoji无法合成');
  
  // 加载状态
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        {/* 加载动画 */}
        <div className="relative">
          {/* 外环 */}
          <div className="absolute inset-0 rounded-full border-4 border-primary-300/30"></div>
          {/* 旋转内环 */}
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-primary-500 border-r-primary-400"></div>
        </div>
        <p className="mt-6 text-white/80 font-medium animate-pulse-slow">正在融合魔法中...</p>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 backdrop-blur-lg bg-white/10 rounded-xl border border-white/20 shadow-glass">
        <div className="text-center p-6 max-w-xs">
          <div className="mb-4 relative">
            <span className="text-5xl block animate-float">😕</span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-secondary-400/50 rounded-full blur-sm"></div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {isNotFoundError ? '无法融合这两个表情' : '出错了'}
          </h3>
          {!isNotFoundError && <p className="text-secondary-300">{error.message}</p>}
          <p className="text-white/70 mt-3 text-sm bg-white/10 py-2 px-3 rounded-lg backdrop-blur-sm inline-block">
            请尝试选择其他表情组合
          </p>
        </div>
      </div>
    );
  }

  // 空状态
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-64 backdrop-blur-lg bg-white/10 rounded-xl border border-white/20 shadow-glass">
        <div className="text-center px-6 max-w-xs">
          <div className="mb-4">
            <div className="inline-block p-4 bg-white/10 rounded-full backdrop-blur-md">
              <span className="text-3xl">👆</span>
            </div>
            <div className="mt-2 w-10 h-1 bg-accent-400/30 rounded-full mx-auto blur-sm"></div>
          </div>
          <p className="text-white/80 text-lg">请选择两个表情进行融合</p>
          <p className="mt-2 text-white/50 text-sm">点击上方按钮开始创建</p>
        </div>
      </div>
    );
  }

  // 结果状态
  return (
    <div className="flex flex-col items-center">
      <div className={`p-4 relative transition-all duration-500 transform ${showImage ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {/* 辉光背景 */}
        <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl transform scale-75"></div>
        
        {/* 悬浮容器 */}
        <div className="bg-white/20 backdrop-blur-md p-5 rounded-2xl shadow-glass border border-white/30 relative">
          {/* 图片加载中动画 */}
          {imageLoading && result.url && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl z-10">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-400 border-t-transparent"></div>
            </div>
          )}
          
          {/* 角标装饰 */}
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-xs">✨</span>
          </div>
          
          {/* 图片容器 */}
          <div className="relative rounded-xl overflow-hidden p-4 min-h-[180px] min-w-[180px] flex items-center justify-center">
            {result.url ? (
              <img 
                src={result.url} 
                alt="合成的Emoji" 
                className="max-h-48 max-w-full object-contain transform transition-all duration-700 hover:scale-110" 
                style={{
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
                  opacity: imageLoading ? 0 : 1,
                  transition: 'opacity 0.5s ease, transform 0.5s ease'
                }}
                onLoad={() => setImageLoading(false)}
                onError={(e) => {
                  setImageLoading(false);
                  e.currentTarget.src = "https://via.placeholder.com/150?text=加载失败"; 
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-48 w-48 bg-white/10 rounded-lg">
                <p className="text-white/70">无法加载图片</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 成功提示 */}
      {showImage && !imageLoading && (
        <div className="mt-4 text-white/80 animate-float bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
          融合成功! 🎉
        </div>
      )}
    </div>
  );
};

export default FusionResult;
