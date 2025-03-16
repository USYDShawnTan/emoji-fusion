import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { loadEmojiData, generateRandomEmojiLink, generateEmojiLink, getDynamicEmojiUrl } from '../utils/emojiUtils';
import fetch from 'node-fetch';
import cors from 'cors';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// 中间件：解析 JSON 请求体
app.use(express.json());

// 添加CORS支持
app.use(cors());

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

// 环境配置
if (process.env.NODE_ENV === 'development') {
  console.log('🔄 开发环境：使用API服务器');
} else {
  console.log('🚀 生产环境：提供API和静态文件服务');
  
  console.log('当前目录:', process.cwd());
  console.log('__dirname:', __dirname);
  
  // 尝试多个可能的dist位置
  const possibleDistPaths = [
    join(__dirname, '../../../dist'),  // 开发环境相对路径
    join(__dirname, '../../dist'),     // 可能的Docker路径
    join(process.cwd(), 'dist'),       // 当前工作目录下的dist
    '/app/dist'                        // Docker中的绝对路径
  ];

  // 查找存在的dist路径
  let distPath = possibleDistPaths.find(path => {
    try {
      return fs.existsSync(path);
    } catch {
      return false;
    }
  });

  if (!distPath) {
    console.error('❌ 无法找到dist目录，使用默认路径');
    distPath = join(__dirname, '../../../dist');
  }

  console.log('✅ 找到静态文件路径:', distPath);
  
  // 设置缓存控制
  app.use(
    express.static(distPath, {
      maxAge: '1d', // 为静态资源设置1天缓存
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          // HTML文件不缓存
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
    })
  );

  // 处理所有其他路由，提供index.html
  app.get('*', (req, res) => {
    // 排除API路由
    if (!req.path.startsWith('/api/')) {
      const indexPath = join(distPath, 'index.html');
      console.log('📄 请求index.html路径:', indexPath);
      console.log('  此路径是否存在:', fs.existsSync(indexPath));
      
      res.sendFile(indexPath);
    }
  });
}

// 启动服务器
app.listen(port, () => {
  console.log(`🚀 服务器运行在 http://localhost:${port}`);
});

export default app;
