/**
 * Emoji 工具类 - 提供 Emoji 处理、合成、显示相关的功能
 */

// 导入本地 JSON 数据
import emojiDataJson from '../data/emojimix_data.json';

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
  
  try {
    // 直接使用导入的数据，无需网络请求
    emojiData = emojiDataJson as EmojiData;
    combinationIndex = buildCombinationIndex(emojiData);
    cachedValidCombinations = Object.keys(combinationIndex);
    isDataLoading = false;
    
    // 创建一个已解析的 Promise 以保持接口一致
    dataLoadingPromise = Promise.resolve();
    return dataLoadingPromise;
  } catch (error) {
    console.error("Failed to load emoji data:", error);
    isDataLoading = false;
    dataLoadingPromise = Promise.reject(error);
    throw error;
  }
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
 * 获取 Google Noto Emoji SVG URL
 * 例如: "☹️" => "https://fonts.gstatic.com/s/e/notoemoji/latest/2639/emoji.svg"
 */
export const getEmojiSvgUrl = (emoji: string): string | null => {
  try {
    const mainUnicode = getMainEmojiUnicode(emoji);
    if (!mainUnicode) return null;
    
    return `https://fonts.gstatic.com/s/e/notoemoji/latest/${mainUnicode}/emoji.svg`;
  } catch (e) {
    console.error("Error getting emoji SVG URL:", e);
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
    // 解析组合以获取原始表情符号
    const [emojiCode1, emojiCode2] = combination.split('_');
    
    // 转换成实际的 Emoji 表情符号
    const emoji1 = unicodeToEmoji(emojiCode1);
    const emoji2 = unicodeToEmoji(emojiCode2);
    
    // 生成 URL 并返回结果
    const date = combinationIndex[combination];
    const url = `${emojiData.baseUrl}${date}/${emojiCode1}/${combination}.png`;
    
    return {
      url,
      emoji1,
      emoji2
    };
  } catch (error) {
    console.error('生成随机 Emoji 组合时出错:', error);
    return null;
  }
}; 