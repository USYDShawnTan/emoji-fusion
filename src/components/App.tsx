import React, { useState, useEffect, useRef } from 'react';
import useEmojiApi from '../hooks/useEmojiApi';
import PageLayout from './layout/PageLayout';
import MainContent from './emoji/MainContent';

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

  // 判断是否已经有合成结果 - 修复类型问题
  const hasResult = Boolean(fusionResult) && Boolean(selectedEmoji1) && Boolean(selectedEmoji2);

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

  // 判断是否可以进行操作（合成或清除）- 修复类型问题
  const canPerformAction = Boolean(hasResult || (selectedEmoji1 && selectedEmoji2)) && !loading && !isFakeLoading;
  
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
    <PageLayout>
      <MainContent 
        selectedEmoji1={selectedEmoji1}
        selectedEmoji2={selectedEmoji2}
        onEmojiSelect1={setSelectedEmoji1}
        onEmojiSelect2={setSelectedEmoji2}
        loading={loading}
        isFakeLoading={isFakeLoading}
        error={error}
        fusionResult={fusionResult}
        isRandomHovered={isRandomHovered}
        hasResult={hasResult}
        canPerformAction={canPerformAction}
        onRandomFusion={handleRandomFusion}
        onManualAction={handleManualAction}
        onRandomHoverChange={setIsRandomHovered}
      />
    </PageLayout>
  );
};

export default App;