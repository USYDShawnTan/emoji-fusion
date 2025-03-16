# 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 配置npm镜像并全局安装pnpm
RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g pnpm@latest

# 首先只复制package.json，利用Docker缓存层
COPY package.json ./

# 修复有问题的依赖版本
RUN sed -i 's/"cross-env": "7.0.5"/"cross-env": "7.0.3"/g' package.json

# 复制.npmrc文件
COPY .npmrc ./

# 安装依赖
RUN pnpm install

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 运行阶段
FROM node:18-alpine

WORKDIR /app

# 配置npm镜像并全局安装pnpm和tsx
RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g pnpm@latest tsx

# 复制构建产物和必要文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src/server ./src/server
COPY --from=builder /app/src/utils ./src/utils
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/.npmrc ./

# 修复运行阶段的package.json中的版本问题
RUN sed -i 's/"cross-env": "7.0.5"/"cross-env": "7.0.3"/g' package.json

# 使用pnpm安装生产依赖
RUN pnpm install --prod

# 设置环境变量
ENV NODE_ENV=production \
    PORT=80

# 暴露端口
EXPOSE 80

# 启动服务器
CMD ["tsx", "src/server/server.ts"]
