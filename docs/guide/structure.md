# 项目结构

本页面介绍 Emoji Fusion 项目的文件结构和组织方式。了解项目结构将帮助您更容易地导航和修改代码。

## 目录结构

项目的主要目录结构如下：

```
emoji-fusion/
├── src/
│   ├── components/     # React组件
│   │   ├── emoji/      # 表情相关组件
│   │   └── layout/     # 布局组件
│   ├── hooks/          # 自定义React Hooks
│   ├── utils/          # 工具函数和辅助方法
│   ├── styles/         # 样式文件
│   └── server/         # Express服务器代码
├── data/               # Emoji数据和更新脚本
├── public/             # 静态资源
├── netlify/            # Netlify部署配置
│   └── functions/      # Netlify函数
└── .github/            # GitHub Actions工作流配置
```

## 核心模块

### 前端组件 (`src/components`)

前端组件按功能分为几个主要目录：

- `emoji/`: 包含与表情符号相关的所有组件
  - `EmojiPicker.tsx`: 表情选择器组件
  - `EmojiSelectionSection.tsx`: 表情选择区域
  - `FusionResult.tsx`: 显示融合结果
  - `MainContent.tsx`: 主要内容区域
  - `ActionButtons.tsx`: 操作按钮组

- `layout/`: 包含布局相关组件
  - `PageLayout.tsx`: 页面整体布局
  - `PageHeader.tsx`: 页面头部
  - `PageFooter.tsx`: 页面底部
  - `EmojiQuantumField.tsx`: 3D粒子效果背景

### 自定义 Hooks (`src/hooks`)

- `useEmojiApi.ts`: 处理表情API调用和状态管理

### 工具函数 (`src/utils`)

- `emojiUtils.ts`: 提供表情处理、Unicode转换和URL生成等功能

### 服务器端 (`src/server`)

- `server.ts`: Express服务器，提供API端点和静态文件服务

### 数据 (`data`)

- `emojimix_data.json`: 表情组合数据
- `update_emoji_data.py`: 更新表情数据的Python脚本

## 构建配置

- `vite.config.ts`: Vite构建配置
- `tailwind.config.js`: Tailwind CSS配置
- `postcss.config.js`: PostCSS配置
- `tsconfig.json`: TypeScript配置

## 部署配置

- `Dockerfile`: Docker容器配置
- `docker-compose.yml`: Docker Compose配置
- `netlify.toml`: Netlify部署配置
- `.github/workflows/`: GitHub Actions工作流配置

## 代码组织原则

Emoji Fusion 项目遵循以下组织原则：

1. **组件化设计**: 将UI分解为可重用的组件
2. **关注点分离**: 将逻辑、UI和样式适当分离
3. **模块化服务**: 将后端功能组织为模块化服务
4. **自动化流程**: 使用CI/CD自动化测试和部署
5. **配置文件集中**: 将关键配置集中在根目录

了解这些原则和结构将帮助您更好地理解项目，以便进行扩展或修改。
