---
outline: deep
lang: zh-CN
---

# Redis

## 概述
Redis 是一个开源的内存数据结构存储系统，可用作数据库、缓存和消息中间件。它具有以下特点：

- **高性能**：数据存储在内存中，读写速度极快
- **丰富的数据结构**：支持字符串、哈希、列表、集合、有序集合等
- **持久化**：支持 RDB 和 AOF 两种持久化方式
- **高可用性**：支持主从复制、哨兵模式、集群模式
- **丰富的功能**：支持事务、Lua 脚本、发布订阅等

Redis 适用于以下场景：
- 缓存系统
- 会话存储
- 排行榜系统
- 消息队列
- 实时数据分析

## 快速部署
本项目的`n-full-cli`提供`Redis`的docker部署配置样板文件。
1. 在准备存放项目的目录下，使用`n-full-cli`工具输入命令创建：
2. 输入命令：`nfull inject`
3. 选择：`Redis`
4. 选择：`docker-compose`或者`docker-swarm`（根据自己的docker模式选择）

```sh:no-line-numbers{6,10}
T  nfull inject
|
o  ? Please select the configuration you want to pop up / 请选择想要弹出的配置
|    MySQL 
|    MongoDB 
|  ❯ Redis 
|    Traefik suite - (traefik+grafana+prometheus+consul+loki+promtail)
|
o  ? Please select a docker run mode / 请选择docker运行模式
|  ❯ docker-compose 
|    docker-swarm
|
o  configuration file inject in ./docker-compose.yml
|
|  You can use 'docker-compose up -d' to start the service
```
以下是docker配置样板文件源码：
::: code-group
```yml [docker-compose.yml]
version: '3.8'

services:
  redis:
    image: redis:latest
    container_name: redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - ./data:/data
    command: redis-server --appendonly yes --requirepass admin123
    networks:
      - redis_network

networks:
  redis_network:
    driver: bridge
```
```yml [docker-swarm.yml]
version: '3.8'

services:
  redis:
    image: redis:latest
    container_name: redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes --requirepass admin123
    deploy:
      mode: replicated
      replicas: 1
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      update_config:
        parallelism: 1
        delay: 10s
    networks:
      - swarm_network

networks:
  swarm_network:
    driver: overlay

volumes:
  redis_data:
    driver: local
```
:::
:::tip 提示
- 配置中默认启用 AOF 持久化模式，以保证数据安全
- 如果使用`docker-swarm`，运行前请先确认`swarm_network`网络是否存在
  - 创建`swarm_network`网络命令：docker network create --driver overlay --attachable swarm_network
  - 运行`docker-swarm.yml`命令：docker stack deploy -c docker-swarm.yml redis
:::
