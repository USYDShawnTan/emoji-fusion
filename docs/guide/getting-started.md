# 快速开始

本页面将指导您安装和运行 Emoji Fusion 项目。

## 开发环境要求

在开始之前，请确保您的系统满足以下要求：

- Node.js 18+
- npm 8+
- Git
- Docker (可选，用于容器化部署)

## 安装步骤

### 1. 克隆仓库

首先，从 GitHub 克隆 Emoji Fusion 仓库：

```bash
git clone https://github.com/USYDShawnTan/emoji-fusion.git
cd emoji-fusion
```

### 2. 安装依赖

使用 npm 安装项目依赖：

```bash
npm install
```

### 3. 启动开发服务器

启动开发服务器，同时运行前端和后端：

```bash
npm run dev
```

这将启动：
- 前端开发服务器：运行在 `http://localhost:5173`
- 后端 API 服务器：运行在 `http://localhost:3000`

现在，您可以在浏览器中访问 `http://localhost:5173` 来使用 Emoji Fusion 应用。

## 构建生产版本

准备好部署时，可以构建生产版本：

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

## 运行生产服务器

构建完成后，您可以启动生产服务器：

```bash
# 启动生产服务器（默认端口3000）
npm run start

# 或指定端口80
npm run start:prod
```

## 问题排查

如果遇到问题，请尝试以下步骤：

1. 确保您的 Node.js 和 npm 版本符合要求
2. 删除 `node_modules` 并重新安装依赖
3. 检查控制台是否有错误信息
4. 查看 [GitHub Issues](https://github.com/USYDShawnTan/emoji-fusion/issues) 是否有类似问题

## 下一步

成功运行项目后，您可以：

- 了解[项目结构](/guide/structure)
- 查看[API文档](/api/)
- 了解如何[部署应用](/deployment/)
