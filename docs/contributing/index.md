# 贡献指南

感谢您对Emoji Fusion项目的关注！我们欢迎各种形式的贡献，包括但不限于代码贡献、文档改进、问题报告和功能请求。本指南将帮助您了解如何参与项目开发。

## 行为准则

参与Emoji Fusion项目的所有贡献者都应遵循以下行为准则：

- 尊重其他贡献者和用户
- 开放、包容的态度接受反馈和建议
- 提供建设性的反馈和讨论

## 贡献流程

### 1. 问题报告

如果您发现了bug或有功能建议，请通过GitHub Issues报告：

1. 检查是否已存在相关issues
2. 使用适当的模板创建新issue
3. 提供详细信息，包括：
   - 问题描述或功能请求
   - 复现步骤（如适用）
   - 预期行为和实际行为
   - 环境信息（浏览器、操作系统等）

### 2. 代码贡献

如果您想直接贡献代码，请遵循以下流程：

1. Fork项目仓库
2. 创建一个新分支：
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. 进行修改并测试
4. 提交更改：
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
   请遵循[约定式提交](https://www.conventionalcommits.org/)规范
5. 推送到您的Fork：
   ```bash
   git push origin feature/your-feature-name
   ```
6. 创建Pull Request

### 3. 文档贡献

文档改进也是非常重要的贡献：

1. Fork项目仓库
2. 修改相关文档
3. 提交Pull Request

## 开发指南

### 分支管理

- `main`: 主分支，包含稳定代码
- `dev`: 开发分支，包含正在开发的功能
- 功能分支: 命名格式为 `feature/feature-name`
- 修复分支: 命名格式为 `fix/issue-description`

### 提交信息规范

我们使用约定式提交规范。每个提交消息应包含类型、可选的范围和描述：

```
<类型>[可选的范围]: <描述>

[可选的正文]

[可选的脚注]
```

常用类型包括：

- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 仅文档更改
- `style`: 不影响代码含义的更改（空格、格式等）
- `refactor`: 既不修复错误也不添加功能的代码更改
- `test`: 添加缺失的测试或修正现有的测试
- `chore`: 不修改src或test文件的更改

### 代码审查流程

所有贡献都将经过代码审查：

1. 审查者将评估代码质量和一致性
2. 可能会要求进行更改
3. 一旦获得批准，贡献将被合并

## 开发环境

关于如何设置开发环境，请参阅[开发环境](/contributing/development)文档。

## 代码风格和标准

有关代码风格和标准的详细信息，请参阅[代码风格](/contributing/code-style)文档。

## 获取帮助

如果您有任何问题或需要帮助，可以：

- 在GitHub Issues上提问
- 查看现有文档

感谢您对Emoji Fusion项目的贡献！
