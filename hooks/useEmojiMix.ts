'use client';

import { useState, useEffect } from 'react';
import { generateEmojiLink } from '../lib/emojiUtils';

/**
 * React Hook 用于合成两个 Emoji
 */
export const useEmojiMix = (emoji1: string, emoji2: string) => {
  const [result, setResult] = useState<{ url: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!emoji1 || !emoji2) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = generateEmojiLink(emoji1, emoji2);
      
      if (url) {
        setResult({ url });
      } else {
        setError('无法合成这两个表情');
      }
    } catch (err) {
      console.error('合成表情出错:', err);
      setError('合成表情失败');
    } finally {
      setLoading(false);
    }
  }, [emoji1, emoji2]);

  return { result, loading, error };
};

export default useEmojiMix; 