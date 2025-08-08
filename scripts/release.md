# 发布流程说明

## 如何创建和推送标签

### 1. 创建标签
```bash
# 创建带注释的标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 或者创建轻量级标签
git tag v1.0.0
```

### 2. 推送标签
```bash
# 推送单个标签
git push origin v1.0.0

# 推送所有标签
git push origin --tags
```

## Docker 镜像标签规则

当您推送不同的标签时，会生成相应的 Docker 镜像标签：

### 语义化版本标签 (推荐)
| Git 标签 | Docker 镜像标签 |
|----------|----------------|
| `v1.0.0` | `1.0.0`, `1.0`, `1`, `v1.0.0` |
| `v1.2.3` | `1.2.3`, `1.2`, `1`, `v1.2.3` |
| `v2.0.0-beta` | `2.0.0-beta`, `v2.0.0-beta` |

### 其他标签
| Git 标签 | Docker 镜像标签 |
|----------|----------------|
| `release-2024` | `release-2024` |
| `stable` | `stable` |

### 分支推送
| Git 分支 | Docker 镜像标签 |
|----------|----------------|
| `main` | `latest`, `main`, `main-<sha>` |
| `develop` | `develop`, `develop-<sha>` |

## 使用示例

```bash
# 发布 v1.0.0
git tag -a v1.0.0 -m "First stable release"
git push origin v1.0.0

# 这会触发 CD 工作流程并创建以下 Docker 镜像：
# - your-username/emoji-fusion:1.0.0
# - your-username/emoji-fusion:1.0  
# - your-username/emoji-fusion:1
# - your-username/emoji-fusion:v1.0.0
```

## 部署说明

- **标签部署**：推送标签会触发版本化部署
- **分支部署**：推送到 main 分支会触发持续部署
- **手动部署**：可以在 GitHub Actions 中手动触发 CD 工作流程
