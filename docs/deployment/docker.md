# Docker 部署

Emoji Fusion 提供了完整的Docker支持，可以快速部署到任何支持Docker的环境中。本指南将详细介绍如何使用Docker部署应用。

## Docker部署优势

使用Docker部署Emoji Fusion有以下优势：

- **环境一致性**：确保开发、测试和生产环境的一致性
- **简化部署**：无需手动安装依赖和配置环境
- **隔离性**：应用运行在隔离的容器中，不影响宿主机
- **可移植性**：可以部署到任何支持Docker的平台
- **扩展性**：可以轻松进行水平扩展

## 前提条件

在开始之前，请确保您的系统已经安装：

- [Docker](https://docs.docker.com/get-docker/) (20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (可选，但推荐)
- Git (用于克隆仓库)

## 使用Docker Compose部署（推荐）

### 1. 克隆仓库

```bash
git clone https://github.com/USYDShawnTan/emoji-fusion.git
cd emoji-fusion
```

### 2. 使用Docker Compose启动服务

项目根目录包含一个`docker-compose.yml`文件，可以直接使用：

```bash
docker-compose up -d
```

这将会：
- 构建Docker镜像
- 创建并启动容器
- 在后台运行服务（-d参数）

默认情况下，服务将在 http://localhost:8080 上可用。

### 3. 查看日志

```bash
docker-compose logs -f
```

使用`Ctrl+C`退出日志查看。

### 4. 停止服务

```bash
docker-compose down
```

## 使用Docker直接部署

如果您不想使用Docker Compose，也可以直接使用Docker命令部署：

### 1. 构建镜像

```bash
docker build -t emoji-fusion .
```

### 2. 运行容器

```bash
docker run -d -p 8080:80 --name emoji-fusion emoji-fusion
```

这将在端口8080上运行服务。

## 自定义配置

### 环境变量

您可以通过环境变量自定义容器的行为：

| 环境变量 | 描述 | 默认值 |
|---------|------|--------|
| `PORT` | 容器内服务监听的端口 | 80 |
| `NODE_ENV` | Node.js运行环境 | production |

### 自定义端口映射

如果要使用其他端口，可以修改端口映射：

```bash
# Docker Compose方式
# 在docker-compose.yml中修改:
# ports:
#   - "自定义端口:80"

# 或使用Docker命令
docker run -d -p 自定义端口:80 --name emoji-fusion emoji-fusion
```

## 生产环境配置

在生产环境中，建议进行以下配置：

### 1. 使用持久化存储

如果需要保存数据，可以挂载存储卷：

```bash
docker run -d -p 8080:80 -v emoji_data:/app/data --name emoji-fusion emoji-fusion
```

### 2. 配置反向代理

在生产环境中，推荐使用Nginx或Traefik作为反向代理，处理SSL终止和请求路由。

Nginx配置示例：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. 启用HTTPS

在生产环境中强烈建议启用HTTPS。可以使用Let's Encrypt免费获取SSL证书：

```bash
# 使用certbot获取证书
certbot --nginx -d your-domain.com
```

## 故障排除

### 常见问题

1. **容器无法启动**

   检查Docker日志：
   ```bash
   docker logs emoji-fusion
   ```

2. **无法访问应用**

   确认端口映射正确：
   ```bash
   docker ps
   ```
   
   检查防火墙设置，确保端口已开放。

3. **应用性能问题**

   检查容器资源使用情况：
   ```bash
   docker stats emoji-fusion
   ```
   
   考虑增加容器资源限制或进行水平扩展。

## 下一步

成功部署后，您可能想要：

- 配置[HTTPS和域名](/deployment/self-hosted#https-configuration)
- 了解[性能优化策略](/deployment/self-hosted#performance-optimization)
- 设置[监控和日志收集](/deployment/self-hosted#monitoring)
