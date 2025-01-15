---
outline: deep
lang: zh-CN
---

# Docker

## 概述
Docker 是一种开源的容器化平台，旨在简化应用程序的开发、部署和运行过程。它提供了一种轻量级、可移植和自包含的容器化环境，使开发人员能够在不同的计算机上以一致的方式构建、打包和分发应用程序。

### Docker 核心概念
- **镜像（Image）**：包含应用程序及其依赖的只读模板
- **容器（Container）**：镜像的运行实例，包含运行时环境和应用
- **仓库（Registry）**：用于存储和分发Docker镜像
- **网络（Network）**：容器间的通信机制
- **数据卷（Volume）**：持久化存储容器数据

### Docker 主要优势
1. **环境一致性**：开发、测试、生产环境完全一致
2. **快速部署**：秒级启动容器实例
3. **资源高效**：共享操作系统内核，资源占用少
4. **可移植性强**：一次构建，随处运行
5. **版本控制**：支持镜像版本管理

### 与项目的关系
**本项目的cli工具所提供的所有环境搭建均基于docker**，包括：
- 数据库环境（MySQL、MongoDB、Redis等）
- 应用服务环境（NestJS、Vue等）
- 监控系统（Prometheus、Grafana等）
- 日志系统（Loki、Promtail等）

## 安装docker

### macOS 安装
1. 访问 [Docker 官网](https://www.docker.com/products/docker-desktop)
2. 下载 Docker Desktop for Mac
3. 双击下载的 .dmg 文件
4. 将 Docker 图标拖动到 Applications 文件夹
5. 打开 Applications 文件夹，双击 Docker 图标启动
6. 按照提示完成安装

### Windows 安装
1. 访问 [Docker 官网](https://www.docker.com/products/docker-desktop)
2. 下载 Docker Desktop for Windows
3. 双击下载的 .exe 文件
4. 按照安装向导完成安装
5. 启用 WSL 2 功能（Windows 10/11）
6. 重启电脑完成安装

### Linux 安装
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# CentOS/RHEL
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
```

## Swarm 初始化
推荐使用`swarm`集群模式，即便你只有一台单机

### 初始化Swarm集群
```bash
# 初始化Swarm
docker swarm init

# 查看Swarm状态
docker info | grep Swarm

# 获取加入Swarm的token
docker swarm join-token manager
docker swarm join-token worker

# 加入Swarm集群
# 作为manager节点加入
docker swarm join --token <manager-token> <manager-ip>:2377

# 作为worker节点加入  
docker swarm join --token <worker-token> <manager-ip>:2377
```

### 常用Swarm命令
```bash
# 查看节点
docker node ls

# 查看服务
docker service ls

# 创建服务
docker service create --name my-service -p 8080:80 nginx

# 扩展服务
docker service scale my-service=3

# 更新服务
docker service update --image nginx:latest my-service

# 创建overlay网络
docker network create --driver overlay --attachable swarm_network

# 部署docker-swarm.yml
docker stack deploy -c docker-swarm.yml stack_name
```

## 拓展文档
- [Docker 官方文档](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Docker Swarm 文档](https://docs.docker.com/engine/swarm/)
