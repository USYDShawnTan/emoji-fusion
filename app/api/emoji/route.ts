import { NextResponse } from 'next/server';
import { loadEmojiData, generateRandomEmojiLink } from '../../../lib/emojiUtils';

// 预加载emoji数据
(async () => {
  try {
    await loadEmojiData();
    console.log('✅ Emoji数据加载成功');
  } catch (err) {
    console.error('❌ Emoji数据加载失败:', err);
  }
})();

// 告诉Next.js这是一个动态路由
export const dynamic = 'force-dynamic';

/**
 * 处理 GET 请求，返回随机 Emoji 组合
 * 支持两种格式：
 * - 默认格式：返回 JSON 格式的图片信息
 * - 图片格式：添加 ?format=pic 参数，直接返回图片
 */
export async function GET(request: Request) {
  try {
    // 解析请求 URL 获取查询参数
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');

    // 生成随机 Emoji 组合
    const result = generateRandomEmojiLink();
    
    if (!result) {
      return NextResponse.json(
        { error: '未找到可用的表情组合' }, 
        { status: 404 }
      );
    }
    
    // 根据 format 参数返回不同格式
    if (format === 'pic') {
      // 直接获取图片并返回
      const response = await fetch(result.url);
      
      if (!response.ok) {
        throw new Error(`获取图片失败: ${response.status}`);
      }
      
      // 获取图片数据和内容类型
      const imageData = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/png';
      
      // 返回图片
      return new NextResponse(imageData, {
        headers: {
          'Content-Type': contentType
        }
      });
    }
    
    // 默认返回 JSON 格式的图片信息
    return NextResponse.json({
      image: result.url,
      emoji1: result.emoji1,
      emoji2: result.emoji2
    });
  } catch (error) {
    console.error('生成随机表情时出错:', error);
    return NextResponse.json(
      { error: '服务器内部错误' }, 
      { status: 500 }
    );
  }
} 