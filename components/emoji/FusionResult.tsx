import React, { useState, useEffect, useRef } from 'react';

interface FusionResultProps {
  loading: boolean;
  error: Error | null;
  result: { url: string } | null;
}

const FusionResult: React.FC<FusionResultProps> = ({ loading, error, result }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // 当result变化时，重置状态
  useEffect(() => {
    if (result) {
      setImageLoading(true);
      setShowImage(false);
      // 调整延迟，让动画更流畅
      setTimeout(() => setShowImage(true), 200);
    }
  }, [result]);

  // 复制图片的函数
  const handleCopyImage = async () => {
    if (imageRef.current && !imageLoading) {
      try {
        // 模拟右键菜单中的"复制图片"功能
        const imgElement = imageRef.current;

        // 创建一个canvas元素
        const canvas = document.createElement('canvas');
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;

        // 在canvas上绘制图像
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(imgElement, 0, 0);

        // 转换canvas为blob并复制到剪贴板
        canvas.toBlob(async (blob) => {
          if (blob) {
            const data = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([data]);
            setCopySuccess(true);

            // 3秒后隐藏成功提示
            setTimeout(() => {
              setCopySuccess(false);
            }, 3000);
          }
        });
      } catch (err) {
        console.error('复制失败:', err);
      }
    }
  };

  // 检查错误类型
  const isNotFoundError = error?.message?.includes('这两个Emoji无法合成');

  // 加载状态
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative">
          {/* 外环 */}
          <div className="absolute inset-0 rounded-full border-4 border-primary-300/30"></div>
          {/* 旋转内环 */}
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-primary-500 border-r-primary-400"></div>
          {/* 反向旋转的第二个环 */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-secondary-400 animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <p className="mt-6 text-white/80 font-medium animate-pulse-slow">正在融合魔法中...</p>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 backdrop-blur-lg bg-white/10 rounded-xl border border-white/20 shadow-glass">
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
      <div className="flex flex-col items-center justify-center py-8 backdrop-blur-lg bg-white/10 rounded-xl border border-white/20 shadow-glass">
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
      <div className={`relative transition-all duration-500 ease-out transform ${showImage ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}>
        {/* 主容器 - 简化设计 */}
        <div className="relative backdrop-blur-xl bg-white/15 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* 图片加载中动画 */}
          {imageLoading && result?.url && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-3xl z-10">
              <div className="relative">
                {/* 外环 */}
                <div className="absolute inset-0 rounded-full border-2 border-primary-300/30 animate-ping"></div>
                {/* 内环 */}
                <div className="animate-spin rounded-full h-12 w-12 border-3 border-transparent border-t-primary-400 border-r-secondary-400"></div>
              </div>
            </div>
          )}

          {/* 图片容器 - 简化设计 */}
          <div className="relative p-8 min-h-[200px] min-w-[200px] flex items-center justify-center">
            {result?.url ? (
              <div className="relative z-10">
                <img
                  ref={imageRef}
                  src={result.url}
                  alt="合成的Emoji"
                  className={`max-h-52 max-w-full object-contain transform transition-all duration-500 ease-out ${imageLoading ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                    } hover:scale-105`}
                  style={{
                    filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.15))',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    setImageLoading(false);
                    e.currentTarget.src = "https://via.placeholder.com/150?text=加载失败";
                  }}
                  crossOrigin="anonymous"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-52 w-52 bg-white/10 rounded-2xl backdrop-blur-sm">
                <p className="text-white/70 font-medium">无法加载图片</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 复制图片按钮 - 替换融合成功提示 */}
      {showImage && !imageLoading && (
        <div className="mt-6 animate-fade-in">
          <button
            onClick={handleCopyImage}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-md rounded-full border border-white/20 shadow-lg hover:from-primary-500/30 hover:to-secondary-500/30 hover:scale-105 transition-all duration-300"
            disabled={imageLoading}
          >
            <span className={`text-lg transition-all duration-300 ${copySuccess ? 'scale-110 text-green-500' : 'text-white/90'
              }`}>
              {copySuccess ? "✅" : "📋"}
            </span>
            <span className="text-white/90 font-medium">
              {copySuccess ? "复制成功!" : "复制图片"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FusionResult;
