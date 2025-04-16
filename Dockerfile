# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# 复制package文件
COPY package.json pnpm-lock.yaml* ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 生产阶段
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# 安装pnpm
RUN npm install -g pnpm

# 复制必要的文件
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml* ./

# 暴露3000端口
EXPOSE 3000

# 设置容器启动命令
CMD ["pnpm", "start"] 