---
outline: deep
---

# Docker部署

## 概述

使用Docker可以轻松地将NestJS应用部署到任何支持Docker的环境中。

## Dockerfile

以下是一个项目模板内置的示例Dockerfile，如有需要请自行修改：

```dockerfile
# 第一阶段：构建阶段
FROM node:18.17.0-alpine AS builder

# 设置工作目录
WORKDIR /app

# 设置npm镜像源
RUN npm config set registry https://registry.npmmirror.com

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install
RUN npm install @swc/cli @swc/core

# 复制所有源代码
COPY . .

# 构建项目
RUN npm run build

# 第二阶段：生产阶段
FROM node:18.17.0-alpine

# 设置工作目录
WORKDIR /app

# 设置npm镜像源
RUN npm config set registry https://registry.npmmirror.com

# 仅复制构建输出和必要的文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/static ./static
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./
COPY --from=builder /app/.env.development ./
COPY --from=builder /app/.env.production ./

# 安装生产依赖
RUN npm install --only=production

# 暴露应用端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production

# 启动应用
CMD ["node", "dist/main"]
```

## 构建和运行Docker镜像

### 构建镜像

在项目根目录下运行以下命令来构建Docker镜像：

```bash
docker build -t nestjs-starter .
```

### 运行容器

构建完成后，可以使用以下命令运行Docker容器：

```bash
docker run -d -p 3000:3000 --name nestjs-starter nestjs-starter
```

### 查看日志

可以使用以下命令查看容器的日志：

```bash
docker logs -f nestjs-starter
```

### 停止和删除容器

使用以下命令停止容器：

```bash
docker stop nestjs-starter
```

使用以下命令删除容器：

```bash
docker rm nestjs-starter
```

## 使用Docker Compose

如果习惯使用`Docker Compose`来部署容器，以下是一个示例`docker-compose.yml`文件：

```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
    deploy:
      replicas: 1 #建议设置多个副本 充分利用多核性能 但需注意多实例带来的坑点
```

### 使用Docker Compose构建和运行

在项目根目录下运行以下命令来构建和运行所有服务：

```bash
docker-compose up --build -d
```

## 使用Docker Swarm

Docker Swarm是Docker的原生集群管理和编排工具。以下是使用Docker Swarm部署NestJS应用的步骤：

### 初始化Swarm

首先，初始化Swarm集群：

```bash
docker swarm init
```

### 创建服务

使用以下命令创建服务：

```bash
docker service create --name nestjs-starter --publish 3000:3000 --replicas 2 nestjs-starter
```
- `--replicas` 设置实例副本数量，建议2个以上，可以实现不停服滚动更新，但需注意多实例带来的坑点

### 查看服务

使用以下命令查看服务状态：

```bash
docker service ls
```

### 更新服务

如果需要更新服务，可以使用以下命令：

```bash
docker service update --image nestjs-starter:latest nestjs-starter
```

### 删除服务

使用以下命令删除服务：

```bash
docker service rm nestjs-starter
```

通过上述配置和命令，您可以使用Docker、Docker Compose和Docker Swarm来部署NestJS应用。

> [!TIP] 提示
> 更多跟容器化运行的相关知识：
> - [docker](https://docs.docker.com/get-started/)
> - [docker compose](https://docs.docker.com/compose/)
> - [docker swarm](https://docs.docker.com/engine/swarm/)
> - [k8s](https://kubernetes.io/docs/home/)