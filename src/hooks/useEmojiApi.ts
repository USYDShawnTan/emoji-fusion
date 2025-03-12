import { useState } from 'react';
import { useEmojiMix } from '../utils/emojiUtils';

interface UseFusionResult {
  loading: boolean;
  error: Error | null;
  fusionResult: any | null;
  fusionEmoji: (emoji1: string, emoji2: string) => Promise<void>;
}

/**
 * 自定义Hook用于处理emoji融合API调用
 * 使用emojiUtils提供的功能，整合为应用所需的接口格式
 */
export const useEmojiApi = (): UseFusionResult => {
  const [emoji1State, setEmoji1] = useState<string>('');
  const [emoji2State, setEmoji2] = useState<string>('');
  const { result, loading, error } = useEmojiMix(emoji1State, emoji2State);

  const fusionEmoji = async (emoji1: string, emoji2: string) => {
    setEmoji1(emoji1);
    setEmoji2(emoji2);
  };

  return {
    loading,
    error: error ? new Error(error) : null,
    fusionResult: result,
    fusionEmoji,
  };
};

export default useEmojiApi;