/**
 * Emoji Fusion API Service
 * 这个服务用于与emoji合成API交互
 */

// API基础URL
const API_BASE_URL = 'https://api.433200.xyz/api';

/**
 * 获取两个emoji的合成结果
 * @param emoji1 第一个emoji字符
 * @param emoji2 第二个emoji字符
 * @returns 返回合成结果的Promise
 */
export const fetchFusionResult = async (emoji1: string, emoji2: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/emoji?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`);
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取emoji合成结果失败:', error);
    throw error;
  }
};