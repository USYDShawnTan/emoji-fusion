import { useState } from 'react';
import { fetchFusionResult } from '../services/emojiApiService';

interface UseFusionResult {
  loading: boolean;
  error: Error | null;
  fusionResult: any | null;
  fusionEmoji: (emoji1: string, emoji2: string) => Promise<void>;
}

/**
 * 自定义Hook用于处理emoji融合API调用
 */
export const useEmojiApi = (): UseFusionResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [fusionResult, setFusionResult] = useState<any | null>(null);

  const fusionEmoji = async (emoji1: string, emoji2: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFusionResult(emoji1, emoji2);
      setFusionResult(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('未知错误'));
      setFusionResult(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fusionResult,
    fusionEmoji,
  };
};

export default useEmojiApi;