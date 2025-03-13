import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from './EmojiPicker';
import FusionResult from './FusionResult';
import EmojiQuantumField from './EmojiQuantumField';
import useEmojiApi from '../hooks/useEmojiApi';

const App: React.FC = () => {
  const [selectedEmoji1, setSelectedEmoji1] = useState<string>('');
  const [selectedEmoji2, setSelectedEmoji2] = useState<string>('');
  const { loading, error, fusionResult, fusionEmoji, randomMix, cacheInfo, clearResult } = useEmojiApi();
  const [isRandomHovered, setIsRandomHovered] = useState(false);
  
  // 使用useRef保存一个标志，表示是否已经进行过合成
  const hasFusedOnce = useRef(false);
  
  // 获取上一次的emoji值，用于检测变化
  const prevEmoji1 = useRef(selectedEmoji1);
  const prevEmoji2 = useRef(selectedEmoji2);

  // 修复：添加一个状态来控制是否显示假加载
  const [isFakeLoading, setIsFakeLoading] = useState(false);
  // 存储随机生成的结果，以便在假加载后使用
  const pendingRandomResult = useRef<{emoji1: string, emoji2: string, resultUrl: string} | null>(null);

  // 判断是否已经有合成结果
  const hasResult = !!fusionResult && selectedEmoji1 && selectedEmoji2;

  // 关键修复：监听两个emoji的变化，但避免与预加载URL冲突
  useEffect(() => {
    const emoji1Changed = prevEmoji1.current !== selectedEmoji1;
    const emoji2Changed = prevEmoji2.current !== selectedEmoji2;
    
    prevEmoji1.current = selectedEmoji1;
    prevEmoji2.current = selectedEmoji2;
    
    // 如果没有变化或者有空值，则不处理
    if ((!emoji1Changed && !emoji2Changed) || !selectedEmoji1 || !selectedEmoji2) {
      return;
    }
    
    // 如果不是骰子操作（骰子操作会单独处理）
    if (hasFusedOnce.current && !isFakeLoading && !loading) {  // 确保不在加载中
      const timer = setTimeout(() => {
        // 只有当不是骰子操作且状态正常时才进行合成
        fusionEmoji(selectedEmoji1, selectedEmoji2);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [selectedEmoji1, selectedEmoji2, fusionEmoji, isFakeLoading, loading]);

  // 修改后的手动触发函数：根据当前状态决定是合成还是清除
  const handleManualAction = () => {
    // 如果已经有合成结果，则清除
    if (hasResult && !loading && !isFakeLoading) {
      // 清除所有状态
      setSelectedEmoji1('');
      setSelectedEmoji2('');
      clearResult();
      hasFusedOnce.current = false;
      return;
    }
    
    // 否则执行合成操作
    if (selectedEmoji1 && selectedEmoji2 && !loading && !isFakeLoading) {
      hasFusedOnce.current = true;
      fusionEmoji(selectedEmoji1, selectedEmoji2);
    }
  };

  // 判断是否可以进行操作（合成或清除）
  const canPerformAction = (hasResult || (selectedEmoji1 && selectedEmoji2)) && !loading && !isFakeLoading;
  
  // 重构：随机合成函数，正确利用预加载URL
  const handleRandomFusion = () => {
    if (loading || isFakeLoading) return; // 防止重复点击
    
    // 如果已经有合成结果，先清除
    if (hasResult) {
      setSelectedEmoji1('');
      setSelectedEmoji2('');
      clearResult();
      hasFusedOnce.current = false;
    }
    
    // 设置假加载状态
    setIsFakeLoading(true);
    
    // 获取随机组合
    const randomResult = randomMix();
    
    if (randomResult) {
      // 存储结果，但不立即使用
      pendingRandomResult.current = randomResult;
      
      // 模拟加载过程
      setTimeout(() => {
        try {
          // 重要修复：先调用fusionEmoji，再设置emoji状态
          // 这样可以避免状态更新触发不必要的useEffect
          fusionEmoji(randomResult.emoji1, randomResult.emoji2, randomResult.resultUrl);
          
          // 假加载结束后，设置emoji显示
          setSelectedEmoji1(randomResult.emoji1);
          setSelectedEmoji2(randomResult.emoji2);
          hasFusedOnce.current = true;
        } finally {
          // 确保无论如何都重置加载状态
          setIsFakeLoading(false);
        }
      }, Math.random() * 50 + 60); // 随机时间模拟加载
    } else {
      console.warn("⚠️ 缓存为空，无法使用随机组合");
      // 即使没有缓存，也结束假加载状态
      setTimeout(() => {
        setIsFakeLoading(false);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/40 via-purple-800/30 to-pink-900/40 py-8 relative overflow-hidden">
      {/* 量子背景场 */}
      <EmojiQuantumField />
      
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Emoji Fusion</h1>
          <p className="text-lg text-gray-200 mt-2">创建你独特的emoji组合!</p>
        </header>
        
        {/* 主要内容 - 增加背景模糊效果以增强可读性 */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-8">
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
          
          {/* 随机合成按钮 - 移除禁用状态 */}
          <div className="flex justify-center mb-6 relative">
            <button
              onClick={handleRandomFusion}
              onMouseEnter={() => setIsRandomHovered(true)}
              onMouseLeave={() => setIsRandomHovered(false)}
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
              onClick={handleManualAction}
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
        </div>
        
        {/* 结果部分也添加背景模糊 */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-center mb-6">合成结果</h2>
          <FusionResult 
            loading={loading || isFakeLoading}
            error={error}
            result={fusionResult}
          />
        </div>
        
        <footer className="text-center text-gray-300 text-sm mt-8">
          Emoji Fusion &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default App;