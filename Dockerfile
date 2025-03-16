# 单阶段构建
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 配置npm镜像并全局安装pnpm和tsx
RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g pnpm@latest tsx

# 首先只复制package.json，利用Docker缓存层
COPY package.json ./

# 复制.npmrc文件
COPY .npmrc ./

# 安装所有依赖（包括开发依赖）
RUN pnpm install

# 复制所有源代码和资源
COPY . .

# 构建应用
RUN pnpm build

# 安装生产依赖（可选：清理开发依赖以减少镜像大小）
# RUN pnpm install --prod

# 设置环境变量
ENV NODE_ENV=production \
    PORT=80

# 暴露端口
EXPOSE 80

# 启动服务器
CMD ["tsx", "src/server/server.ts"]
