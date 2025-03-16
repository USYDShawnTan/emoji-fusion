# 构建阶段
FROM node:18-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package.json package-lock.json ./

# 安装依赖
RUN npm ci

# 复制所有源代码
COPY . .

# 构建前端应用
RUN npm run build

# 运行阶段
FROM node:18-alpine

WORKDIR /app

# 复制构建产物和服务器文件
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
COPY --from=build /app/src/server ./src/server
COPY --from=build /app/src/utils ./src/utils
COPY --from=build /app/tsconfig.json ./

# 只安装生产环境依赖
RUN npm ci --production

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=80

# 暴露80端口
EXPOSE 80

# 启动服务器
CMD ["npx", "tsx", "src/server/server.ts"]
