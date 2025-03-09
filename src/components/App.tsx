import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from './EmojiPicker';
import FusionResult from './FusionResult';
import useEmojiApi from '../hooks/useEmojiApi';

const App: React.FC = () => {
  const [selectedEmoji1, setSelectedEmoji1] = useState<string>('');
  const [selectedEmoji2, setSelectedEmoji2] = useState<string>('');
  const { loading, error, fusionResult, fusionEmoji } = useEmojiApi();
  const [isRandomHovered, setIsRandomHovered] = useState(false);
  
  // 使用useRef保存一个标志，表示是否已经进行过合成
  const hasFusedOnce = useRef(false);
  
  // 获取上一次的emoji值，用于检测变化
  const prevEmoji1 = useRef(selectedEmoji1);
  const prevEmoji2 = useRef(selectedEmoji2);

  // 监听两个emoji的变化，自动触发融合逻辑
  useEffect(() => {
    const emoji1Changed = prevEmoji1.current !== selectedEmoji1;
    const emoji2Changed = prevEmoji2.current !== selectedEmoji2;
    
    prevEmoji1.current = selectedEmoji1;
    prevEmoji2.current = selectedEmoji2;
    
    if ((!emoji1Changed && !emoji2Changed) || !selectedEmoji1 || !selectedEmoji2) {
      return;
    }
    
    if (hasFusedOnce.current) {
      const timer = setTimeout(() => {
        fusionEmoji(selectedEmoji1, selectedEmoji2);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [selectedEmoji1, selectedEmoji2, fusionEmoji]);

  // 手动触发融合
  const handleManualFusion = () => {
    if (selectedEmoji1 && selectedEmoji2 && !loading) {
      hasFusedOnce.current = true;
      fusionEmoji(selectedEmoji1, selectedEmoji2);
    }
  };

  const canFuse = selectedEmoji1 && selectedEmoji2 && !loading;
  
  // 随机合成：调用API后，不仅设置选中的emoji，还立即触发合成
  const handleRandomFusion = async () => {
    try {
      const res = await fetch('https://api.433200.xyz/api/emoji?type=random');
      if (res.ok) {
        const data = await res.json();
        setSelectedEmoji1(data.emoji1);
        setSelectedEmoji2(data.emoji2);
        // 立即触发合成
        hasFusedOnce.current = true;
        fusionEmoji(data.emoji1, data.emoji2);
      }
    } catch (err) {
      console.error('随机合成失败', err);
    }
  };

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
          
          {/* 随机合成按钮 - 使用🎲按钮，并在悬停时放大、旋转并显示文字 */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleRandomFusion}
              onMouseEnter={() => setIsRandomHovered(true)}
              onMouseLeave={() => setIsRandomHovered(false)}
              style={{ transform: isRandomHovered ? "scale(1.2)" : "scale(1)" }}
              className="p-3 rounded-full bg-blue-500 text-white transition-all duration-300"
            >
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f3b2/512.gif"
                alt="随机emoji"
                className="w-6 h-6"
              />
            </button>
          </div>
          
          {/* 合成按钮 */}
          <div className="flex justify-center items-center mt-8">
            <button 
              onClick={handleManualFusion}
              disabled={!canFuse}
              className={`
                py-3 px-8 rounded-full text-lg font-bold flex items-center justify-center
                transition-all duration-200 w-48 transform hover:scale-[1.1]
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
        
        {/* 结果部分 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-center mb-6">合成结果</h2>
          <FusionResult 
            loading={loading}
            error={error}
            result={fusionResult}
          />
        </div>
        
        <footer className="text-center text-gray-500 text-sm mt-8">
          Emoji Fusion &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default App;