// netlify/functions/api.js
const serverless = require('serverless-http');
const path = require('path');

// 设置环境变量，告诉服务器它在 Netlify Functions 环境中运行
process.env.NETLIFY_FUNCTION = 'true';

// 配置 serverless-http
const serverlessConfig = {
  basePath: '/.netlify/functions/api',
  binary: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
  provider: {
    env: process.env
  }
};

// 改进的错误处理
module.exports.handler = async (event, context) => {
  try {
    // 添加日志，帮助调试
    console.log('Netlify函数启动，当前工作目录:', process.cwd());
    console.log('NODE_PATH:', process.env.NODE_PATH);
    
    // 确保上下文对象存在
    context = context || {};
    context.callbackWaitsForEmptyEventLoop = false;
    
    // 动态导入Express应用
    const serverModule = await import('../../src/server/server.js');
    const app = serverModule.default; 
    
    if (!app) {
      throw new Error('无法导入Express应用');
    }
    
    // 包装Express应用为serverless函数
    const handler = serverless(app, serverlessConfig);
    
    // 调用处理程序
    return await handler(event, context);
  } catch (error) {
    console.error('函数错误:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: '服务器内部错误',
        error: error.message,
        stack: error.stack
      })
    };
  }
};
