import { NextResponse } from 'next/server';
import { loadEmojiData, generateEmojiLink, getDynamicEmojiUrl } from '../../../../lib/emojiUtils';
import { METRICS_ENABLED, httpLatency, httpRequestCounter } from '../../../../lib/metrics';

// 确保 emoji 数据已加载
(async () => {
  try {
    await loadEmojiData();
  } catch (err) {
    console.error('❌ Emoji数据加载失败:', err);
  }
})();

// 告诉Next.js这是一个动态路由
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * 处理 GET 请求，支持两种格式:
 * 1. emoji1+emoji2 - 合成两个特定表情
 * 2. emoji - 获取单个表情的动态图片
 * 
 * 每种格式都支持两种返回类型:
 * - 默认: 返回 JSON 格式的图片信息
 * - 图片: 添加 ?format=pic 参数，直接返回图片
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const routeLabel = '/api/emoji/[slug]';
  let statusLabel = '200';
  const endTimer = METRICS_ENABLED
    ? httpLatency.startTimer({ route: routeLabel, method: 'GET' })
    : undefined;
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');

    // 检查是否是表情组合格式（包含 +）
    if (slug.includes('+')) {
      // 处理表情组合
      const [emoji1, emoji2] = slug.split('+');

      if (!emoji1 || !emoji2) {
        statusLabel = '400';
        return NextResponse.json(
          { error: '需要提供两个表情' },
          { status: 400 }
        );
      }

      const imageUrl = generateEmojiLink(emoji1, emoji2);

      if (!imageUrl) {
        statusLabel = '404';
        return NextResponse.json(
          { error: '该表情组合不存在' },
          { status: 404 }
        );
      }

      // 根据 format 参数返回不同格式
      if (format === 'pic') {
        // 直接获取图片并返回
        const response = await fetch(imageUrl);

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
        image: imageUrl,
        emoji1,
        emoji2
      });
    } else {
      // 处理单个表情
      const emoji = decodeURIComponent(slug);
      const imageUrl = getDynamicEmojiUrl(emoji);

      if (!imageUrl) {
        statusLabel = '404';
        return NextResponse.json(
          { error: '未找到该表情' },
          { status: 404 }
        );
      }

      // 根据 format 参数返回不同格式
      if (format === 'pic') {
        // 直接获取图片并返回
        const response = await fetch(imageUrl);

        if (!response.ok) {
          throw new Error(`获取图片失败: ${response.status}`);
        }

        // 获取图片数据和内容类型
        const imageData = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/gif';

        // 返回图片
        return new NextResponse(imageData, {
          headers: {
            'Content-Type': contentType
          }
        });
      }

      // 默认返回 JSON 格式的图片信息
      return NextResponse.json({
        image: imageUrl,
        emoji
      });
    }
  } catch (error) {
    console.error('处理表情请求时出错:', error);
    statusLabel = '500';
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
  finally {
    if (METRICS_ENABLED) {
      endTimer?.({ status: statusLabel });
      // 根据 URL 类型标注 provider
      const provider = 'gstatic';
      httpRequestCounter.inc({
        route: routeLabel,
        method: 'GET',
        status: statusLabel,
        provider,
      });
    }
  }
} 