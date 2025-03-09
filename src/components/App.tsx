import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from './EmojiPicker';
import FusionResult from './FusionResult';
import useEmojiApi from '../hooks/useEmojiApi';

const App: React.FC = () => {
  const [selectedEmoji1, setSelectedEmoji1] = useState<string>('');
  const [selectedEmoji2, setSelectedEmoji2] = useState<string>('');
  const { loading, error, fusionResult, fusionEmoji } = useEmojiApi();
  
  // 使用useRef保存一个标志，表示是否已经进行过合成
  const hasFusedOnce = useRef(false);
  
  // 获取上一次的emoji值，用于检测变化
  const prevEmoji1 = useRef(selectedEmoji1);
  const prevEmoji2 = useRef(selectedEmoji2);

  // 监听两个emoji的变化，应用逻辑：
  // 1. 如果从未合成过，不自动触发
  // 2. 如果已经合成过至少一次，则emoji变化时自动触发
  useEffect(() => {
    // 检查是否有emoji变化
    const emoji1Changed = prevEmoji1.current !== selectedEmoji1;
    const emoji2Changed = prevEmoji2.current !== selectedEmoji2;
    
    // 更新上一次的值，用于下次比较
    prevEmoji1.current = selectedEmoji1;
    prevEmoji2.current = selectedEmoji2;
    
    // 如果没有变化，或者两个emoji中有任何一个没有选择，则不触发
    if ((!emoji1Changed && !emoji2Changed) || !selectedEmoji1 || !selectedEmoji2) {
      return;
    }
    
    // 关键逻辑：只有当hasFusedOnce为true时，才自动触发
    if (hasFusedOnce.current) {
      // 添加短暂延迟，避免用户频繁切换时过多API请求
      const timer = setTimeout(() => {
        fusionEmoji(selectedEmoji1, selectedEmoji2);
      }, 300); // 300ms延迟
      
      return () => clearTimeout(timer);
    }
  }, [selectedEmoji1, selectedEmoji2, fusionEmoji]);

  // 手动触发融合的处理函数
  const handleManualFusion = () => {
    if (selectedEmoji1 && selectedEmoji2 && !loading) {
      // 设置标志，表示已经进行过至少一次合成
      hasFusedOnce.current = true;
      fusionEmoji(selectedEmoji1, selectedEmoji2);
    }
  };

  // 检查是否可以合成
  const canFuse = selectedEmoji1 && selectedEmoji2 && !loading;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600">Emoji Fusion</h1>
          <p className="text-lg text-gray-600 mt-2">创建你独特的emoji组合!</p>
        </header>
        
        {/* 选择器部分 - 上方两个正方形容器 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-center gap-12 mb-8">
            <div className="w-[170px]">
              <EmojiPicker 
                selectedEmoji={selectedEmoji1} 
                onEmojiSelect={setSelectedEmoji1}
                label="第一个Emoji"
              />
            </div>
             <span className="text-4xl mt-6">➕</span>
            <div className="w-[170px]">
              <EmojiPicker 
                selectedEmoji={selectedEmoji2} 
                onEmojiSelect={setSelectedEmoji2}
                label="第二个Emoji"
              />
            </div>
          </div>
          
          {/* 合成按钮 - 始终显示但根据状态禁用 */}
          <div className="flex justify-center items-center mt-8">
            <button 
              onClick={handleManualFusion}
              disabled={!canFuse}
              className={`
                py-3 px-8 rounded-full text-lg font-bold flex items-center justify-center
                transition-all duration-200 w-48
                ${canFuse 
                  ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  🌟 合成中~
                </>
              ) : (
                <>
                  🌟 emoji合成
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* 结果部分 - 下方居中 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-center mb-6">合成结果</h2>
          <FusionResult 
            loading={loading}
            error={error}
            result={fusionResult}
          />
        </div>
        
        {/* 页脚信息 */}
        <footer className="text-center text-gray-500 text-sm mt-8">
          Emoji Fusion &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default App;