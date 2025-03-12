import { useState, useRef, useEffect, useCallback } from 'react';
import { useEmojiMix, generateRandomEmojiLink, loadEmojiData, getGoogleEmojiImage } from '../utils/emojiUtils';

interface UseFusionResult {
  loading: boolean;
  error: Error | null;
  fusionResult: { url: string } | null;
  fusionEmoji: (emoji1: string, emoji2: string) => Promise<void>;
  randomMix: () => { emoji1: string, emoji2: string, resultUrl: string } | null;
  cacheInfo: { total: number, ready: boolean };
}

// 每组缓存包含两个emoji源和一个合成结果
interface EmojiSet {
  emoji1: { char: string, url: string };
  emoji2: { char: string, url: string };
  result: { url: string };
}

// 常量配置
const CACHE_SET_COUNT = 10;  // 缓存5组完整的emoji套件

export const useEmojiApi = (): UseFusionResult => {
  // 普通emoji合成状态
  const [emoji1, setEmoji1] = useState<string>('');
  const [emoji2, setEmoji2] = useState<string>('');
  const { result, loading: apiLoading, error: apiError } = useEmojiMix(emoji1, emoji2);
  
  // 状态管理
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [fusionResult, setFusionResult] = useState<{ url: string } | null>(null);
  
  // 缓存相关Ref
  const cachedSets = useRef<EmojiSet[]>([]); 
  const isCacheReady = useRef<boolean>(false);
  const isPreloading = useRef<boolean>(false);
  const initDataLoaded = useRef<boolean>(false);
  
  // 初始化emoji数据
  useEffect(() => {
    const initializeData = async () => {
      if (initDataLoaded.current) return;
      
      try {
        await loadEmojiData();
        initDataLoaded.current = true;
        console.log("🔄 Emoji数据加载完成");
        
        // 初始预加载缓存
        preloadCache();
      } catch (err) {
        console.error("❌ 初始化错误:", err);
        setError(new Error("初始化失败"));
      }
    };
    
    initializeData();
  }, []);

  // 预加载缓存
  const preloadCache = useCallback(async () => {
    if (isPreloading.current) return;
    isPreloading.current = true;
    
    console.log("🔄 开始预加载缓存");
    try {
      // 计算需要加载的数量
      const neededCount = CACHE_SET_COUNT - cachedSets.current.length;
      if (neededCount <= 0) {
        isPreloading.current = false;
        return;
      }
      
      // 并行预加载多个套件
      const promises = [];
      for (let i = 0; i < neededCount; i++) {
        promises.push(preloadSingleSet());
      }
      
      const results = await Promise.all(promises);
      const validResults = results.filter((item): item is EmojiSet => item !== null);
      
      // 添加到缓存
      cachedSets.current = [...cachedSets.current, ...validResults];
      
      console.log(`✅ 预加载完成，当前缓存${cachedSets.current.length}组`);
      isCacheReady.current = cachedSets.current.length > 0;
    } catch (err) {
      console.error("❌ 预加载失败:", err);
    } finally {
      isPreloading.current = false;
    }
  }, []);
  
  // 预加载单个emoji套件(含两个emoji源和一个合成结果)
  const preloadSingleSet = async (): Promise<EmojiSet | null> => {
    try {
      // 使用emojiUtils中的方法获取随机组合
      const randomMix = generateRandomEmojiLink();
      if (!randomMix) return null;
      
      // 使用getGoogleEmojiImage获取emoji源图片链接
      const emoji1Url = getGoogleEmojiImage(randomMix.emoji1);
      const emoji2Url = getGoogleEmojiImage(randomMix.emoji2);
      
      if (!emoji1Url || !emoji2Url) {
        console.warn("无法获取emoji源图片链接", randomMix.emoji1, randomMix.emoji2);
        return null;
      }
      
      // 并行预加载三个URL (两个emoji源 + 一个合成结果)
      await Promise.all([
        preloadImage(emoji1Url),
        preloadImage(emoji2Url),
        preloadImage(randomMix.url)
      ]);
      
      return {
        emoji1: { char: randomMix.emoji1, url: emoji1Url },
        emoji2: { char: randomMix.emoji2, url: emoji2Url },
        result: { url: randomMix.url }
      };
    } catch (err) {
      console.error("预加载单个套件失败:", err);
      return null;
    }
  };
  
  // 辅助函数：预加载单个图像
  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`图片加载失败: ${url}`));
      img.src = url;
    });
  };

  // 获取一个随机缓存的组合
  const getRandomCachedSet = (): EmojiSet | null => {
    if (cachedSets.current.length === 0) return null;
    
    // 随机选择一个缓存项
    const index = Math.floor(Math.random() * cachedSets.current.length);
    const selected = cachedSets.current[index];
    
    // 从缓存中移除
    cachedSets.current = [
      ...cachedSets.current.slice(0, index),
      ...cachedSets.current.slice(index + 1)
    ];
    
    // 使用了一个，异步补充缓存
    if (cachedSets.current.length < 3) {
      setTimeout(() => preloadCache(), 0);
    }
    
    return selected;
  };
  
  // 提供一个随机组合(不执行合成)，供App使用
  const randomMix = useCallback(() => {
    const set = getRandomCachedSet();
    if (!set) return null;
    
    return {
      emoji1: set.emoji1.char,
      emoji2: set.emoji2.char,
      resultUrl: set.result.url
    };
  }, []);

  // 常规合成函数 - 添加可选的预加载结果URL参数
  const fusionEmoji = useCallback(async (emoji1: string, emoji2: string, preloadedResultUrl?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // 如果提供了预加载的结果URL，直接使用
      if (preloadedResultUrl) {
        // 设置emoji以保持一致性
        setEmoji1(emoji1);
        setEmoji2(emoji2);
        // 直接设置结果，跳过API调用
        setFusionResult({ url: preloadedResultUrl });
        setLoading(false);
        return;
      }
      
      // 常规处理流程 - 设置emoji触发API调用
      setEmoji1(emoji1);
      setEmoji2(emoji2);
      // 注意：loading状态会在API响应后在useEffect中设置为false
    } catch (err) {
      console.error("❌ 合成错误:", err);
      setError(err instanceof Error ? err : new Error('合成失败'));
      setLoading(false);
    }
  }, []);

  // 处理API结果
  useEffect(() => {
    if (!apiLoading && result) {
      setFusionResult(result);
      setLoading(false);
    }
    
    if (!apiLoading && apiError) {
      setError(new Error(apiError));
      setLoading(false);
    }
  }, [apiLoading, result, apiError]);

  return {
    loading: loading || apiLoading,
    error,
    fusionResult,
    fusionEmoji,
    randomMix,
    cacheInfo: {
      total: cachedSets.current.length,
      ready: isCacheReady.current
    }
  };
};

export default useEmojiApi;