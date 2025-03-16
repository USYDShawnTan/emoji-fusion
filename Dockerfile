# 构建阶段
FROM node:18-alpine AS builder

# 全局安装pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制包管理文件
COPY package.json pnpm-lock.yaml* .npmrc ./

# 安装依赖
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 运行阶段
FROM node:18-alpine

WORKDIR /app

# 全局安装 tsx
RUN npm install -g tsx

# 复制构建产物和必要文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml* ./
COPY --from=builder /app/src/server ./src/server
COPY --from=builder /app/src/utils ./src/utils
COPY --from=builder /app/tsconfig.json ./
COPY .npmrc ./

# 安装生产依赖
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

# 清理不必要的文件
RUN rm -rf /root/.local/share/pnpm/store .npmrc

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
