import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { loadEmojiData, generateRandomEmojiLink, generateEmojiLink, getDynamicEmojiUrl } from '../utils/emojiUtils';
import path from 'path';
import fs from 'fs/promises';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// 创建缓存目录
const CACHE_DIR = join(__dirname, '../../cache');
(async () => {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (err) {
    console.error('创建缓存目录失败:', err);
  }
})();

// 中间件：解析 JSON 请求体
app.use(express.json());

/**
 * API 路由说明：
 * 1. 随机组合：/api/random
 * 2. 合成表情：/api/emoji1+emoji2
 * 3. 动态表情：/api/emoji
 * 
 * 每个接口都支持两种返回格式：
 * - 默认格式：返回 JSON 格式的图片信息
 * - 图片格式：添加 ?format=pic 参数，直接返回图片
 */

// 预加载emoji数据
(async () => {
  try {
    await loadEmojiData();
    console.log('✅ Emoji数据加载成功');
  } catch (err) {
    console.error('❌ Emoji数据加载失败:', err);
  }
})();

// 辅助函数：获取并缓存外部图片
async function getAndCacheImage(url: string, cacheKey: string) {
  const cachePath = join(CACHE_DIR, `${cacheKey}.png`);
  
  try {
    // 检查缓存中是否已存在
    try {
      await fs.access(cachePath);
      return cachePath; // 缓存中存在，直接返回路径
    } catch (error) {
      // 缓存中不存在，继续获取
    }
    
    // 获取远程图片
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`获取图片失败: ${response.status}`);
    }
    
    // 将图片保存到缓存
    const buffer = await response.buffer();
    await fs.writeFile(cachePath, buffer);
    
    return cachePath;
  } catch (error) {
    console.error(`缓存图片失败 (${url}):`, error);
    return null;
  }
}

// 1. 随机组合两个表情
app.get('/api/random', async (req, res) => {
  try {
    const result = generateRandomEmojiLink();
    if (!result) {
      return res.status(404).json({ error: '未找到可用的表情组合' });
    }
    
    // 根据 format 参数返回不同格式
    const format = req.query.format as string;
    if (format === 'pic') {
      // 获取并缓存图片
      const cacheKey = `random_${result.emoji1}_${result.emoji2}`;
      const imagePath = await getAndCacheImage(result.url, cacheKey);
      
      if (imagePath) {
        // 直接返回图片文件
        return res.sendFile(imagePath);
      } else {
        // 如果缓存失败，则重定向
        return res.redirect(result.url);
      }
    }
    
    // 默认返回 JSON 格式的图片信息
    return res.json({
      image: result.url,
      emoji1: result.emoji1,
      emoji2: result.emoji2
    });
  } catch (error) {
    console.error('生成随机表情时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 2. 合成两个表情或获取单个表情
app.get('/api/:combination', async (req, res) => {
  try {
    const { combination } = req.params;
    
    // 检查是否是表情组合格式
    if (!combination.includes('+')) {
      // 如果不是组合格式，则作为单个表情处理
      const result = getDynamicEmojiUrl(combination);
      
      if (!result) {
        return res.status(404).json({ error: '未找到该表情' });
      }
      
      // 根据 format 参数返回不同格式
      const format = req.query.format as string;
      if (format === 'pic') {
        // 获取并缓存图片
        const cacheKey = `single_${combination}`;
        const imagePath = await getAndCacheImage(result, cacheKey);
        
        if (imagePath) {
          // 直接返回图片文件
          return res.sendFile(imagePath);
        } else {
          // 如果缓存失败，则重定向
          return res.redirect(result);
        }
      }
      
      // 默认返回 JSON 格式的图片信息
      return res.json({ image: result });
    }
    
    // 处理表情组合
    const [emoji1, emoji2] = combination.split('+');
    
    if (!emoji1 || !emoji2) {
      return res.status(400).json({ error: '需要提供两个表情' });
    }
    
    const result = generateEmojiLink(emoji1, emoji2);
    
    if (!result) {
      return res.status(404).json({ error: '该表情组合不存在' });
    }
    
    // 根据 format 参数返回不同格式
    const format = req.query.format as string;
    if (format === 'pic') {
      // 获取并缓存图片
      const cacheKey = `combined_${emoji1}_${emoji2}`;
      const imagePath = await getAndCacheImage(result, cacheKey);
      
      if (imagePath) {
        // 直接返回图片文件
        return res.sendFile(imagePath);
      } else {
        // 如果缓存失败，则重定向
        return res.redirect(result);
      }
    }
    
    // 默认返回 JSON 格式的图片信息
    return res.json({ image: result });
  } catch (error) {
    console.error('处理表情时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 开放访问缓存目录中的图片
app.use('/cache', express.static(CACHE_DIR));

// 在开发环境下，代理到Vite服务器
if (process.env.NODE_ENV === 'development') {
  console.log('🔄 开发环境：使用API服务器');
} else {
  // 在生产环境，提供静态文件服务
  app.use(express.static(join(__dirname, '../../../dist')));

  // 处理所有其他路由，提供index.html
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../../../dist/index.html'));
  });
}

// 启动服务器
app.listen(port, () => {
  console.log(`🚀 服务器运行在 http://localhost:${port}`);
});

export default app;