![emoji-fusion](https://socialify.git.ci/USYDShawnTan/emoji-fusion/image?forks=1&issues=1&language=1&pulls=1&stargazers=1)

## Emoji Fusion 表情融合

一个基于 Next.js 的互动应用：选择两个 Emoji，一键融合生成 Emoji Kitchen 风格的合成图。内置高质量 UI、随机探索、一键复制图片等体验。

### 功能
- **两两融合**：支持从选择器挑选任意两个表情进行融合
- **随机组合**：内置缓存与预加载，丝滑随机出图
- **动/静态预览**：选表情时悬停显示动态 GIF，默认展示 SVG 静态图
- **一键复制图片**：将融合结果复制到剪贴板
- **API 可复用**：通过内置 API 随机或指定组合生成图片链接/图片流

### 技术栈
- **框架**：Next.js 14、React 18、TypeScript
- **样式**：Tailwind CSS
- **组件**：emoji-mart（Google Set）
- **数据**：本地 `data/emojimix_data_compact.json`（Emoji Kitchen 组合索引）
- **容器化**：Docker 多阶段构建（standalone 运行）

---

## 本地开发

### 前置要求
- Node.js 18+
- pnpm 8+（推荐）

### 安装与启动
```bash
pnpm install
pnpm dev
```
默认访问 `http://localhost:3000`。

### 构建与生产运行
```bash
pnpm build
pnpm start
```

### 常用脚本
```bash
pnpm lint          # 代码检查
pnpm lint:fix      # 自动修复
pnpm type-check    # TS 类型检查
pnpm analyze       # 构建体积分析
```

---

## Docker

开发（docker-compose）
```bash
pnpm docker:dev
```

生产镜像与运行
```bash
pnpm docker:build
pnpm docker:run
```
Dockerfile 使用多阶段构建并输出 Next.js standalone 产物，容器启动后监听 `3000` 端口。

---

## API 文档

本应用通过 Next.js Route Handlers 暴露 API：

- `GET /api/emoji`
  - 功能：随机返回一个可用的 Emoji 融合组合
  - 参数：`format=pic` 时直接返回图片二进制；否则返回 JSON

- `GET /api/emoji/:slug`
  - 两种用法：
    - `/:emoji1+emoji2` 指定两个表情进行融合
    - `/:emoji` 返回该表情的动态 GIF（非融合）
  - 参数：`format=pic` 同上

示例：
```bash
# 1) 随机组合 - 返回 JSON
curl http://localhost:3000/api/emoji

# 2) 随机组合 - 直接返回图片并保存
curl -L "http://localhost:3000/api/emoji?format=pic" -o random.png

# 3) 指定组合（直接用 Emoji 字符）- 返回 JSON
curl "http://localhost:3000/api/emoji/😀+😂"

# 4) 指定组合 - 直接返回图片
curl -L "http://localhost:3000/api/emoji/😀+😂?format=pic" -o combo.png

# 5) 单个 Emoji 的动态 GIF
curl -L "http://localhost:3000/api/emoji/😀?format=pic" -o smile.gif
```

返回 JSON（示例）：
```json
{
  "image": "https://.../u1f600_u1f602.png",
  "emoji1": "😀",
  "emoji2": "😂"
}
```

---

## 目录结构（关键）

```
emoji-fusion/
├─ app/
│  ├─ api/
│  │  └─ emoji/
│  │     ├─ [slug]/route.ts      # 指定组合/单表情动态图 API
│  │     └─ route.ts             # 随机组合 API
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx                   # 入口页，挂载 App
├─ components/
│  ├─ App.tsx                    # 应用壳与交互逻辑胶水层
│  ├─ emoji/
│  │  ├─ EmojiPicker.tsx        # 表情选择器（动态/静态预览）
│  │  ├─ EmojiSelectionSection.tsx
│  │  ├─ ActionButtons.tsx      # 随机/融合/清除 按钮
│  │  ├─ FusionResult.tsx       # 结果展示与复制
│  │  └─ MainContent.tsx
│  └─ layout/
│     ├─ PageLayout.tsx
│     ├─ PageHeader.tsx
│     ├─ PageFooter.tsx
│     └─ EmojiQuantumField.tsx
├─ hooks/
│  ├─ useEmojiApi.ts            # 融合流程、缓存与预加载
│  └─ useEmojiMix.ts            # 将两个 Emoji 映射为合成图 URL
├─ lib/
│  └─ emojiUtils.ts             # 数据加载、URL 生成、Unicode 转换
├─ data/
│  └─ emojimix_data_compact.json# Emoji Kitchen 组合索引与基准路径
├─ Dockerfile
├─ docker-compose.yml
├─ next.config.js
├─ package.json
└─ tailwind.config.js
```

---

## 实现要点

- `lib/emojiUtils.ts`
  - 本地加载 `emojimix_data_compact.json`，构建组合索引
  - 将 Emoji 转 Unicode 格式（如 `😀` → `u1f600`），拼装合成图 URL
  - 提供 `generateEmojiLink(emoji1, emoji2)`、`generateRandomEmojiLink()`、`getEmojiSvgUrl()`、`getDynamicEmojiUrl()` 等方法

- `hooks/useEmojiApi.ts`
  - 维护融合状态与错误处理
  - 预加载若干随机组合（含两个源图与合成结果），提高随机出图速度
  - 支持“假加载”过渡动画与一键清除

- 前端交互
  - 选择器采用 emoji-mart 的 Google 表情数据集
  - 悬停预览动态 GIF（来源 `fonts.gstatic.com`），默认展示 SVG 静态图
  - 合成结果支持复制到剪贴板（Canvas 转 Blob）

---

## 配置与可定制
- 远程图片白名单：`next.config.js` 中 `images.remotePatterns`
- 样式主题：`tailwind.config.js` 与 `app/globals.css`
- Docker 构建：`Dockerfile`、`docker-compose.yml`

本项目当前不需要额外环境变量。

---

## 贡献
欢迎 PR 与 Issue！提交前请：
- 使用 `pnpm lint`、`pnpm type-check` 保持代码质量
- 保持命名清晰、类型安全与可读性
- 如修改行为，请补充或更新相应文档

---

## 许可证
MIT，详见 `LICENSE`。
