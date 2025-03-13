![emoji-fusion](https://socialify.git.ci/USYDShawnTan/emoji-fusion/image?description=1&font=Jost&forks=1&issues=1&language=1&logo=https%3A%2F%2Femoji.433200.xyz%2Ffavicon.svg&name=1&pattern=Circuit+Board&pulls=1&stargazers=1&theme=Light)
# Emoji Fusion 表情融合

这是一个互动性强的网页应用，允许用户将两个表情符号融合成一个全新的创意表情！应用基于 React 构建，使用 Tailwind CSS 设计，并集成了 Three.js 实现量子粒子特效。

## ✨ 功能特点

- 丰富的表情符号选择器，支持各类标准 emoji
- 智能融合算法，基于 Google Emoji Kitchen 技术
- 随机融合功能，一键探索有趣组合
- 3D 量子特效背景，带来沉浸式体验
- 响应式设计，完美支持移动端和桌面端

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **样式**: Tailwind CSS
- **3D 渲染**: Three.js (量子粒子场效果)
- **构建工具**: Vite
- **打包优化**: Rollup 代码分割
- **部署选项**: Netlify, Docker/Nginx

## 🚀 快速开始

### 安装

1. 克隆仓库：
   ```
   git clone https://github.com/USYDShawnTan/emoji-fusion.git
   ```
2. 进入项目目录：
   ```
   cd emoji-fusion
   ```
3. 安装依赖：
   ```
   npm install
   ```

### 本地开发

启动开发服务器:

```
npm run dev
```

应用将在 `http://localhost:5173` 上运行

### 构建生产版本

```
npm run build
```

构建产物将输出到 `dist` 目录

## 🐳 Docker 部署

### 使用预构建镜像（最简单）

可以直接从 Docker Hub 拉取预构建的镜像：

```bash
# 拉取镜像
docker pull xiaotanyyds/emoji-fusion:latest

# 运行容器
docker run -d -p 8080:80 --name emoji-fusion xiaotanyyds/emoji-fusion
```

应用将在 http://localhost:8080 上可用。

### 使用 Docker Compose

1. 确保已安装 [Docker](https://docs.docker.com/get-docker/) 和 [Docker Compose](https://docs.docker.com/compose/install/)

2. 创建 `docker-compose.yml` 文件或使用项目中已有的配置：

   ```yaml
   version: "3"
   services:
     emoji-fusion:
       image: xiaotanyyds/emoji-fusion:latest
       # 或者从源码构建
       # build: .
       ports:
         - "8080:80"
       restart: unless-stopped
   ```

3. 运行容器：

   ```bash
   docker-compose up -d
   ```

### 自定义构建

如果需要自定义构建：

```bash
# 构建镜像
docker build -t emoji-fusion .

# 运行容器
docker run -d -p 8080:80 --name emoji-fusion emoji-fusion
```

更多详细信息和高级配置，请参见 [DOCKER.md](./DOCKER.md)。

## 🌐 API 说明

本应用使用 Google Emoji Kitchen API 技术，但不依赖外部服务器。应用通过 `useEmojiApi` Hook 处理表情融合逻辑：

- 预加载常用表情组合，提供顺畅用户体验
- 通过缓存机制减少数据请求，优化性能
- 提供静态和动态表情展示选项

查看源码中的 [`useEmojiApi`](./src/hooks/useEmojiApi.ts) 和 [`emojiUtils`](./src/utils/emojiUtils.ts) 了解更多实现细节。

## 📋 自定义配置

可通过修改以下文件定制应用：

- [`tailwind.config.js`](./tailwind.config.js): 调整样式主题
- [`vite.config.ts`](./vite.config.ts): 配置构建参数
- [`nginx.conf`](./nginx.conf): 自定义部署设置

## 👥 贡献

欢迎提交问题或拉取请求，以改进项目功能或修复 bug。请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。详情查看 [LICENSE](./LICENSE) 文件。
