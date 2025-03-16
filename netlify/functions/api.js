// netlify/functions/api.js
const serverless = require('serverless-http');

// 由于主应用使用ES模块，而Netlify函数通常使用CommonJS，
// 我们需要动态导入Express应用
module.exports.handler = async (event, context) => {
  try {
    // 动态导入ES模块
    const { default: app } = await import('../../src/server/server.js');
    // 包装Express应用为serverless函数
    const handler = serverless(app);
    // 调用处理程序
    return await handler(event, context);
  } catch (error) {
    console.error('函数错误:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: '服务器内部错误',
        error: error.message
      })
    };
  }
};
