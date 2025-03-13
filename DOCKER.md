# Docker 部署指南 - Emoji Fusion

本文档提供了使用 Docker 部署 Emoji Fusion 应用的详细说明。

## 文件说明

- `Dockerfile`: 多阶段构建文件，用于构建应用并创建生产环境镜像
- `nginx.conf`: Nginx 配置文件，用于提供静态文件服务和处理单页应用路由
- `.dockerignore`: 排除不必要的文件，减小构建上下文大小
- `docker-compose.yml`: 简化容器的构建和运行

## 使用方法

### 使用 Docker Compose（推荐）

1. 确保已安装 [Docker](https://docs.docker.com/get-docker/) 和 [Docker Compose](https://docs.docker.com/compose/install/)

2. 在项目根目录下运行：

   ```bash
   docker-compose up -d
   ```

   这将构建镜像并在后台启动容器。应用将在 http://localhost:8080 上可用。

3. 查看容器日志：

   ```bash
   docker-compose logs -f
   ```

4. 停止并移除容器：

   ```bash
   docker-compose down
   ```

### 使用 Docker 命令

如果不想使用 Docker Compose，也可以直接使用 Docker 命令：

1. 构建镜像：

   ```bash
   docker build -t emoji-fusion .
   ```

2. 运行容器：

   ```bash
   docker run -d -p 8080:80 --name emoji-fusion emoji-fusion
   ```

3. 停止并移除容器：

   ```bash
   docker stop emoji-fusion
   docker rm emoji-fusion
   ```

## 自定义配置

### 修改端口

如果需要更改应用的访问端口，请编辑 `docker-compose.yml` 文件中的 `ports` 部分：

```yaml
ports:
  - "新端口:80"
```

### 环境变量

如果应用需要环境变量，请取消注释 `docker-compose.yml` 文件中的 `environment` 部分，并添加所需的环境变量。

## 生产环境部署注意事项

1. 在生产环境中，建议配置 HTTPS。可以使用 Nginx 代理或使用 Certbot 等工具自动配置 SSL 证书。

2. 考虑添加监控和日志收集工具，如 Prometheus、Grafana 或 ELK 堆栈。

3. 设置适当的资源限制，以防止容器使用过多的系统资源：

   ```yaml
   services:
     emoji-fusion:
       # 其他配置...
       deploy:
         resources:
           limits:
             cpus: "0.5"
             memory: 512M
   ```

## 故障排除

1. 如果应用无法访问，请检查容器是否正在运行：

   ```bash
   docker ps
   ```

2. 检查容器日志：

   ```bash
   docker logs emoji-fusion
   ```

3. 如果需要进入容器内部进行调试：

   ```bash
   docker exec -it emoji-fusion /bin/sh
   ```
