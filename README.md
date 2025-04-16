![emoji-fusion](https://socialify.git.ci/USYDShawnTan/emoji-fusion/image?description=1&font=Jost&forks=1&issues=1&language=1&logo=https%3A%2F%2Femoji.433200.xyz%2Ffavicon.svg&name=1&pattern=Circuit+Board&pulls=1&stargazers=1&theme=Light)

# Emoji Fusion 表情融合 [![Docker Build](https://github.com/USYDShawnTan/emoji-fusion/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/USYDShawnTan/emoji-fusion/actions/workflows/docker-publish.yml) [![Emoji Data Update](https://github.com/USYDShawnTan/emoji-fusion/actions/workflows/update_emoji_data.yml/badge.svg)](https://github.com/USYDShawnTan/emoji-fusion/actions/workflows/update_emoji_data.yml)

这是一个互动性强的网页应用，允许用户将两个表情符号融合成一个全新的创意表情！应用基于 Next.js 和 React 构建，使用 Tailwind CSS 设计，并集成了 Three.js 实现量子粒子特效。

## 🚀 特性

- **自动更新**: 每日自动更新最新的 emoji 组合数据
- **多平台支持**: Docker 镜像支持 AMD64 和 ARM64 架构
- **生产就绪**: 完整的 CI/CD 流程，包括自动构建、测试和部署
- **安全性**: 集成漏洞扫描，确保容器安全
- **服务器端渲染**: 使用 Next.js 实现更好的 SEO 和初始加载性能
- **API 路由**: 使用 Next.js API Routes 提供后端服务

## 📢 更新: 迁移至 Next.js 和 pnpm

最新版本已将项目迁移至 Next.js 框架，提供更好的性能和开发体验：

- **服务器端渲染**：提升首屏加载速度和 SEO 表现
- **API Routes**：集成 API 端点，无需单独的 Express 服务器
- **改进的路由系统**：基于文件系统的直观路由
- **包管理器升级**：使用 pnpm 替代 npm，提供更快的安装速度和更小的磁盘占用
- **Docker 优化**：多阶段构建流程，减小镜像大小

## ✨ 功能特点

- 丰富的表情符号选择器，支持各类标准 emoji
- 智能融合算法，基于 Google Emoji Kitchen 技术
- 随机融合功能，一键探索有趣组合
- 3D 量子特效背景，带来沉浸式体验
- 响应式设计，完美支持移动端和桌面端

## 🛠️ 技术栈

- **前端框架**: Next.js 14 + React 18 + TypeScript
- **样式**: Tailwind CSS
- **3D 渲染**: Three.js (量子粒子场效果)
- **包管理**: pnpm
- **容器化**: Docker 多阶段构建
- **API**: Next.js API Routes

## 🚀 快速开始

## 🛠️ 开发环境要求

- Node.js 18+
- pnpm 8+ (推荐) 或 npm 8+
- Docker (可选，用于容器化部署)
- Git

### 安装

1. 克隆仓库：
   ```bash
   git clone https://github.com/USYDShawnTan/emoji-fusion.git
   ```
2. 进入项目目录：
   ```bash
   cd emoji-fusion
   ```
3. 安装依赖：
   ```bash
   pnpm install
   ```

### 本地开发

启动开发服务器:

```
pnpm dev
```

应用将在 `http://localhost:3000` 上运行

### 构建生产版本

```
pnpm build
```

构建产物将输出到 `.next` 目录

### 运行生产服务器

```
pnpm start
```

## 🐳 Docker 部署

### 使用 Docker Compose (开发环境)

```bash
# 启动开发环境
pnpm docker:dev
```

### 使用 Docker (生产环境)

```bash
# 构建镜像
pnpm docker:build

# 运行容器
pnpm docker:run
```

应用将在 http://localhost:3000 上可用。

## 🌐 API 说明

本应用使用 Next.js API Routes 提供以下端点：

- `/api/emoji` - 随机组合两个表情
- `/api/emoji/:slug` - 合成两个特定表情 (格式: emoji1+emoji2) 或获取单个表情

每个端点支持两种返回格式：

- 默认: 返回 JSON 格式的图片信息
- 图片: 添加`?format=pic`参数，直接返回图片

## 📋 自定义配置

可通过修改以下文件定制应用：

- [`tailwind.config.js`](./tailwind.config.js): 调整样式主题
- [`next.config.js`](./next.config.js): 配置 Next.js 参数
- [`Dockerfile`](./Dockerfile): 调整 Docker 构建设置
- [`docker-compose.yml`](./docker-compose.yml): 配置 Docker 开发环境

## 📁 项目结构

```
emoji-fusion/
├── app/                # Next.js应用目录
│   ├── api/           # API Routes
│   ├── components/    # React组件
│   └── page.tsx       # 主页
├── lib/               # 工具函数和库
├── public/            # 静态资源
├── styles/            # 全局样式
└── .github/           # GitHub Actions工作流
```

## 🔧 性能优化

- **服务器端渲染**: 使用 Next.js SSR 提升首屏加载速度
- **图片优化**: 自动图片优化和 WebP 支持
- **代码分割**: 自动代码分割和懒加载
- **Docker 多阶段构建**: 减小生产镜像大小
- **pnpm**: 高效的依赖管理和磁盘空间利用

## 👥 贡献指南

1. Fork 本仓库并克隆到本地
2. 创建新分支：
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. 进行修改并测试
4. 提交变更：
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
   请遵循[约定式提交](https://www.conventionalcommits.org/)规范
5. 推送到分支：
   ```bash
   git push origin feature/amazing-feature
   ```
6. 打开 Pull Request

### 开发流程

- 确保代码通过所有测试
- 遵循项目的代码风格和最佳实践
- 更新相关文档
- 添加必要的测试用例

## 📄 许可证

本项目基于 MIT 许可证开源。详情查看 [LICENSE](./LICENSE) 文件。
