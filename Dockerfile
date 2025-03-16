# 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 配置npm镜像并全局安装pnpm
RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g pnpm@latest

# 首先只复制package.json和.npmrc，利用Docker缓存层
COPY package.json .npmrc* ./

# 修复有问题的依赖版本
RUN sed -i 's/"cross-env": "7.0.5"/"cross-env": "7.0.3"/g' package.json

# 安装依赖（不使用frozen-lockfile）
RUN pnpm install

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 运行阶段
FROM node:18-alpine

WORKDIR /app

# 配置npm镜像和安装tsx
RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g tsx

# 复制构建产物和必要文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src/server ./src/server
COPY --from=builder /app/src/utils ./src/utils
COPY --from=builder /app/tsconfig.json ./

# 安装生产依赖（使用npm而非pnpm，因为只需要在此阶段使用一次）
RUN npm install --omit=dev

# 设置环境变量
ENV NODE_ENV=production \
    PORT=80

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT/api/health || exit 1

# 暴露端口
EXPOSE 80

# 启动服务器
CMD ["tsx", "src/server/server.ts"]
