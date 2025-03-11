/**
 * Emoji 工具类 - 提供 Emoji 处理、合成、显示相关的功能
 */

// 数据类型定义
interface EmojiData {
  baseUrl: string;
  dates: string[];
  emojis: Record<string, string[]>;
}

interface EmojiCombination {
  url: string;
  emoji1: string;
  emoji2: string;
}

// ----- Emoji 数据管理 -----
let emojiData: EmojiData | null = null;
let combinationIndex: Record<string, string> = {};
let cachedValidCombinations: string[] = [];
let isDataLoading = false;
let dataLoadingPromise: Promise<void> | null = null;

/**
 * 加载 Emoji 合成数据
 */
export const loadEmojiData = async (): Promise<void> => {
  if (emojiData !== null) return;
  if (isDataLoading) return dataLoadingPromise as Promise<void>;
  
  isDataLoading = true;
  dataLoadingPromise = fetch('https://raw.githubusercontent.com/USYDShawnTan/emojimix/refs/heads/main/emojimix_data.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load emoji data');
      return response.json();
    })
    .then(data => {
      emojiData = data;
      combinationIndex = buildCombinationIndex(data);
      cachedValidCombinations = Object.keys(combinationIndex);
      isDataLoading = false;
    })
    .catch(error => {
      console.error("Failed to load emoji data:", error);
      isDataLoading = false;
      throw error;
    });
  
  return dataLoadingPromise;
};

/**
 * 构建 Emoji 组合索引
 */
const buildCombinationIndex = (data: EmojiData): Record<string, string> => {
  const index: Record<string, string> = {};
  
  for (const dateIndex in data.emojis) {
    const date = data.dates[parseInt(dateIndex)];
    for (const emojiPath of data.emojis[dateIndex]) {
      index[emojiPath] = date;
    }
  }
  
  return index;
};

// ----- Unicode 编码转换 -----

/**
 * 获取 Emoji 的完整 Unicode 序列 (用于静态图片 URL)
 * 例如: "☹️" => "2639-fe0f"
 */
export const getCompleteEmojiUnicode = (emoji: string): string | null => {
  try {
    if (!emoji || emoji.length === 0) return null;
    
    let codePointStr = '';
    let i = 0;
    
    while (i < emoji.length) {
      const codePoint = emoji.codePointAt(i);
      if (codePoint === undefined) break;
      
      // 添加当前码点
      if (codePointStr) codePointStr += '-';
      codePointStr += codePoint.toString(16).toLowerCase();
      
      // 处理代理对 (如表情符号)
      if (codePoint > 0xFFFF) {
        i += 2;
      } else {
        i += 1;
      }
    }
    
    return codePointStr;
  } catch (e) {
    console.error("Error getting complete emoji unicode:", e);
    return null;
  }
};

/**
 * 获取 Emoji 的主要 Unicode 码点 (用于动态图片 URL)
 * 例如: "☹️" => "2639"，忽略变体选择器
 */
export const getMainEmojiUnicode = (emoji: string): string | null => {
  try {
    if (!emoji || emoji.length === 0) return null;
    
    const codePoint = emoji.codePointAt(0);
    if (codePoint === undefined) return null;
    
    return codePoint.toString(16).toLowerCase();
  } catch (e) {
    console.error("Error getting main emoji unicode:", e);
    return null;
  }
};

/**
 * 将 Emoji 转换为带 u 前缀的 Unicode 码点 (用于 Emoji 组合)
 * 例如: "😀" => "u1f600"
 */
const emojiToUnicode = (emoji: string): string => {
  if (emoji.length === 1) {
    const cp = emoji.codePointAt(0);
    return cp ? `u${cp.toString(16).toLowerCase()}` : '';
  }
  
  const codes: string[] = [];
  let i = 0;
  
  while (i < emoji.length) {
    const codePoint = emoji.codePointAt(i);
    if (codePoint === undefined) break;
    
    codes.push(`u${codePoint.toString(16).toLowerCase()}`);
    
    if (codePoint > 0xFFFF) {
      i += 2;
    } else {
      i += 1;
    }
  }
  
  return codes.join('-');
};

/**
 * 将 Unicode 码点转换回 Emoji 字符
 * 例如: "u1f600" => "😀"
 */
const unicodeToEmoji = (code: string): string => {
  if (code.includes('-')) {
    try {
      const parts = code.split('-');
      return parts.map(part => {
        const cleanPart = part.startsWith('u') ? part.slice(1) : part;
        return String.fromCodePoint(parseInt(cleanPart, 16));
      }).join('');
    } catch (error) {
      console.error('Error converting unicode to emoji:', error);
      return '[emoji]';
    }
  } else {
    try {
      const cleanCode = code.startsWith('u') ? code.slice(1) : code;
      return String.fromCodePoint(parseInt(cleanCode, 16));
    } catch (error) {
      console.error('Error converting unicode to emoji:', error);
      return '[emoji]';
    }
  }
};

// ----- 图片 URL 生成 -----

/**
 * 获取 Google 风格的静态 Emoji 图片 URL
 * 例如: "☹️" => "https://cdn.jsdelivr.net/npm/emoji-datasource-google/img/google/64/2639-fe0f.png"
 */
export const getGoogleEmojiImage = (emoji: string): string | null => {
  try {
    const codePointStr = getCompleteEmojiUnicode(emoji);
    if (!codePointStr) return null;
    
    return `https://cdn.jsdelivr.net/npm/emoji-datasource-google/img/google/64/${codePointStr}.png`;
  } catch (e) {
    console.error("Error getting Google emoji image:", e);
    return null;
  }
};

/**
 * 获取 Google Noto 动态 Emoji GIF URL
 * 例如: "☹️" => "https://fonts.gstatic.com/s/e/notoemoji/latest/2639/512.gif"
 */
export const getDynamicEmojiUrl = (emoji: string): string | null => {
  try {
    const mainUnicode = getMainEmojiUnicode(emoji);
    if (!mainUnicode) return null;
    
    return `https://fonts.gstatic.com/s/e/notoemoji/latest/${mainUnicode}/512.gif`;
  } catch (e) {
    console.error("Error getting dynamic emoji URL:", e);
    return null;
  }
};

// ----- Emoji 合成功能 -----

/**
 * 生成两个 Emoji 的合成图片链接
 */
export const generateEmojiLink = (emoji1: string, emoji2: string): string | null => {
  if (!emojiData) return null;
  
  const left = emojiToUnicode(emoji1);
  const right = emojiToUnicode(emoji2);
  
  const combination1 = `${left}_${right}`;
  const combination2 = `${right}_${left}`;
  
  if (combination1 in combinationIndex) {
    const date = combinationIndex[combination1];
    return `${emojiData.baseUrl}${date}/${left}/${combination1}.png`;
  } else if (combination2 in combinationIndex) {
    const date = combinationIndex[combination2];
    return `${emojiData.baseUrl}${date}/${right}/${combination2}.png`;
  }
  
  return null;
};

/**
 * 生成随机 Emoji 组合
 */
export const generateRandomEmojiLink = (): EmojiCombination | null => {
  if (!emojiData || cachedValidCombinations.length === 0) return null;
  
  // 随机选择一个组合
  const randomIndex = Math.floor(Math.random() * cachedValidCombinations.length);
  const combination = cachedValidCombinations[randomIndex];
  
  try {
    // 分割组合以获取左右编码
    const [leftCode, rightCodeWithExt] = combination.split('_');
    const rightCode = rightCodeWithExt.replace(/\.png$/, '');
    
    const date = combinationIndex[combination];
    const url = `${emojiData.baseUrl}${date}/${leftCode}/${combination}.png`;
    
    const emoji1 = unicodeToEmoji(leftCode);
    const emoji2 = unicodeToEmoji(rightCode);
    
    return { url, emoji1, emoji2 };
  } catch (error) {
    console.error("Failed to process random emoji:", error);
    return null;
  }
};

// ----- React Hooks -----

/**
 * React Hook: 用于 Emoji 合成
 */
import { useState, useEffect } from 'react';

export const useEmojiMix = (emoji1: string, emoji2: string) => {
  const [result, setResult] = useState<{ url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMixedEmoji = async () => {
      if (!emoji1 || !emoji2) {
        setResult(null);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // 确保数据已加载
        if (!emojiData) {
          await loadEmojiData();
        }
        
        const url = generateEmojiLink(emoji1, emoji2);
        
        if (url) {
          setResult({ url });
        } else {
          setError("这两个Emoji无法合成");
        }
      } catch (err) {
        console.error("Error during emoji fusion:", err);
        setError("合成过程中出错");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMixedEmoji();
  }, [emoji1, emoji2]);
  
  return { result, loading, error };
};

/**
 * React Hook: 用于随机 Emoji 组合
 */
export const useRandomEmojiMix = () => {
  const [result, setResult] = useState<EmojiCombination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const getRandomMix = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!emojiData) {
        await loadEmojiData();
      }
      
      const randomMix = generateRandomEmojiLink();
      
      if (randomMix) {
        setResult(randomMix);
      } else {
        setError("无法生成随机Emoji组合");
      }
    } catch (err) {
      console.error("Error generating random emoji mix:", err);
      setError("生成随机组合过程中出错");
    } finally {
      setLoading(false);
    }
  };
  
  // 预加载数据
  useEffect(() => {
    loadEmojiData().catch(err => console.error("Failed to preload emoji data:", err));
  }, []);
  
  return { result, loading, error, getRandomMix };
};

// 预加载数据
loadEmojiData().catch(console.error);