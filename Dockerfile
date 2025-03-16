# 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 配置npm镜像
RUN npm config set registry https://registry.npmmirror.com

# 全局安装pnpm
RUN npm install -g pnpm

# 复制lockfile和配置
COPY package.json pnpm-lock.yaml* ./

# 安装依赖
RUN pnpm install --frozen-lockfile

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
COPY --from=builder /app/pnpm-lock.yaml* ./
COPY --from=builder /app/src/server ./src/server
COPY --from=builder /app/src/utils ./src/utils
COPY --from=builder /app/tsconfig.json ./

# 安装生产依赖
RUN npm install -g pnpm && \
    pnpm install --prod --frozen-lockfile && \
    npm uninstall -g pnpm

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
