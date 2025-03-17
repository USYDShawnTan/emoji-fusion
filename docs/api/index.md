# API 概述

Emoji Fusion 提供了一组简单易用的API，用于表情符号融合和获取。本页面概述了可用的API端点、参数和使用方法。

## API 基础

### 基础URL

- **开发环境**: `http://localhost:3000/api`
- **生产环境**: 取决于您的部署方式，例如 `https://your-domain.com/api`

### 响应格式

所有API端点默认以JSON格式返回数据，但也支持直接返回图片。通过添加`?format=pic`参数可以直接获取图片而非JSON数据。

### 错误处理

API错误会返回适当的HTTP状态码和JSON格式的错误信息：

```json
{
  "error": "错误信息描述"
}
```

## 可用端点

Emoji Fusion API 提供以下端点：

### 1. 随机表情组合

获取随机组合的两个表情符号。

- **端点**: `/api/random`
- **方法**: GET
- **参数**: 
  - `format` (可选): 设置为 `pic` 直接返回图片

**示例请求**:
```
GET /api/random
GET /api/random?format=pic
```

**示例响应** (JSON):
```json
{
  "url": "https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f600/u1f600_u1f62d.png",
  "emoji1": "😀",
  "emoji2": "😭"
}
```

### 2. 特定表情组合

合成两个指定的表情符号。

- **端点**: `/api/:combination`
- **方法**: GET
- **URL参数**: 
  - `combination`: 格式为 `emoji1+emoji2`，例如 `😀+😭`
- **查询参数**:
  - `format` (可选): 设置为 `pic` 直接返回图片

**示例请求**:
```
GET /api/😀+😭
GET /api/😀+😭?format=pic
```

**示例响应** (JSON):
```json
{
  "url": "https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f600/u1f600_u1f62d.png",
  "emoji1": "😀",
  "emoji2": "😭"
}
```

### 3. 单个表情信息

获取单个表情符号的信息。

- **端点**: `/api/:emoji`
- **方法**: GET
- **URL参数**: 
  - `emoji`: 单个表情符号，例如 `😀`
- **查询参数**:
  - `format` (可选): 设置为 `pic` 直接返回图片

**示例请求**:
```
GET /api/😀
GET /api/😀?format=pic
```

**示例响应** (JSON):
```json
{
  "emoji": "😀",
  "unicode": "1f600",
  "name": "grinning face",
  "svg_url": "https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/emoji.svg"
}
```

## 使用限制

- API没有实施速率限制，但请合理使用
- 某些表情组合可能不可用，API会返回相应的错误

## 客户端集成

在前端应用中，推荐使用[useEmojiApi](/api/hooks) Hook来与API交互，它提供了更便捷的功能和错误处理。

有关API实现的更多详细信息，请查看[API端点](/api/endpoints)、[Hooks](/api/hooks)和[工具函数](/api/utils)文档。
