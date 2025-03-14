import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { loadEmojiData, generateRandomEmojiLink, generateEmojiLink, getDynamicEmojiUrl } from '../utils/emojiUtils';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

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

// 辅助函数：获取图片并直接发送
async function fetchAndSendImage(url: string, res: express.Response) {
  try {
    // 获取远程图片
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`获取图片失败: ${response.status}`);
    }
    
    // 获取内容类型
    const contentType = response.headers.get('content-type') || 'image/png';
    
    // 设置响应头
    res.setHeader('Content-Type', contentType);
    
    // 直接将图片数据流传递给客户端
    response.body.pipe(res);
  } catch (error) {
    console.error(`获取图片失败 (${url}):`, error);
    res.status(500).send('获取图片失败');
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
      // 直接获取图片并发送
      return fetchAndSendImage(result.url, res);
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
        // 直接获取图片并发送
        return fetchAndSendImage(result, res);
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
      // 直接获取图片并发送
      return fetchAndSendImage(result, res);
    }
    
    // 默认返回 JSON 格式的图片信息
    return res.json({ image: result });
  } catch (error) {
    console.error('处理表情时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

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