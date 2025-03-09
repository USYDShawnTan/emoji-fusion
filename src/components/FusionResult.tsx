import React from 'react';

interface FusionResultProps {
  loading: boolean;
  error: Error | null;
  result: any | null;
}

const FusionResult: React.FC<FusionResultProps> = ({ loading, error, result }) => {
  // 检查是否是404错误（无法合成的emoji组合）
  const isNotFoundError = error?.message?.includes('404');
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">正在合成中，请稍候...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center p-6">
          <span className="text-4xl mb-4 block">😕</span>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {isNotFoundError ? '这两个emoji不能合成噢' : '出错了'}
          </h3>
          {!isNotFoundError && <p className="text-red-600">{error.message}</p>}
          <p className="text-gray-500 mt-2">请尝试其他emoji组合</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">选择两个emoji并点击合成按钮</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* 显示合成后的图片 - 缩小尺寸 */}
      <div className="p-2 flex items-center justify-center">
        {result.url ? (
          <img 
            src={result.url} 
            alt="合成的Emoji" 
            className="max-h-48 max-w-full object-contain" // 从max-h-64改为max-h-48
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/150?text=加载失败"; // 也缩小了占位图
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-48 w-48 bg-gray-100 rounded-lg">
            <p className="text-gray-500">无法加载图片</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FusionResult;