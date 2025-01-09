---
outline: deep
---

# N-Full-Cli

## 概述
`n-full-cli`是专为`N-Full-Kit`开发的命令行工具，用于快速的从内置模板中创建项目和弹出一些docker配置文件。

## 安装
```bash
npm install -g n-full-cli
```

## 命令
`n-full-cli`或者短别名`nfull`:
  - `nfull create` 从内置模板创建项目，然后开始选择项目类型：
     - backend / 后端 <small>（以下是后端项目模板）</small> 
       - NestJS+Mysql
       - NestJS+Mongo
     - frontend / 前端 <small>（以下是前端项目模板）</small> 
       - Vue3+Arco Design Admin
       - Vue3+Arco Design Admin pure
       - Flutter+GetX
       - Uniapp+NutUI
       - Electron+Vue+Nest
  - `nfull inject` 快速生成一个`docker-compose`或者`docker-swarm`配置文件
     - MongoDB
     - MySQL
     - Redis
     - Traefik suite <small>（traefik+grafana+prometheus+consul+loki+promtail的运维套装）</small>