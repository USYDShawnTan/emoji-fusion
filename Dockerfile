FROM node:20-slim AS builder

WORKDIR /app

# 安装特定版本的 pnpm 以确保兼容性
RUN npm install -g pnpm@9

# 复制 package 文件
COPY package.json pnpm-lock.yaml ./

# 设置 pnpm 配置
RUN pnpm config set use-running-store-server false

# 安装依赖 (如果 lockfile 不兼容就重新生成)
RUN pnpm install --frozen-lockfile || pnpm install

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 生产运行阶段
FROM node:20-slim AS runner

WORKDIR /app

# 安装运行时依赖
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制数据文件
COPY --from=builder --chown=nextjs:nodejs /app/data ./data

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/emoji || exit 1

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]