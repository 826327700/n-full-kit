# N-Full-CLI

## 介绍

N-Full-CLI 是一个基于 Node.js 的全栈开发套件 N-Full-Kit 的 CLI 工具。它提供了一些命令来帮助开发者快速创建和管理项目。

## 安装

你可以通过以下命令全局安装 N-Full-CLI：

```bash
npm install -g n-full-cli
```

## 使用

### 创建新项目

使用 `create` 命令从模板创建一个新项目：

```bash
n-full-cli create
```

该命令将引导你选择项目类型（后端或前端）和具体的模板（例如 NestJS+Mysql、NestJS+Mongo、Vue3+Arco Design Admin 等），然后下载并初始化项目。

### 弹出 Docker 配置

使用 `inject` 命令弹出一些 Docker Compose 或 Docker Swarm 配置文件：

```bash
n-full-cli inject
```

该命令将引导你选择要弹出的配置（例如 MongoDB、MySQL、Redis、Traefik 套件等），并根据选择下载相应的配置文件。

