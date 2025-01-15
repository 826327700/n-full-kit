---
outline: deep
lang: zh-CN
---

# MySQL

## 概述
MySQL 是一个流行的开源关系型数据库管理系统，广泛应用于各种 Web 应用程序中。它具有以下特点：

- **关系型数据存储**：数据以表格形式存储，支持复杂的关系操作
- **ACID 事务支持**：保证数据的一致性和完整性
- **高性能**：支持索引、视图、存储过程等优化查询性能
- **高可用性**：支持主从复制、集群等架构
- **丰富的功能**：支持触发器、存储过程、视图等高级功能

MySQL 适用于以下场景：
- 需要严格数据一致性的应用程序
- 需要处理结构化数据的应用
- 需要复杂事务支持的系统
- 需要与其他关系型数据库集成的场景

## 快速部署
本项目的`n-full-cli`提供`MySQL`的docker部署配置样板文件。
1. 在准备存放项目的目录下，使用`n-full-cli`工具输入命令创建：
2. 输入命令：`nfull inject`
3. 选择：`MySQL`
4. 选择：`docker-compose`或者`docker-swarm`（根据自己的docker模式选择）

```sh:no-line-numbers{4,10}
T  nfull inject
|
o  ? Please select the configuration you want to pop up / 请选择想要弹出的配置
|  ❯ MySQL 
|    MongoDB 
|    Redis 
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
  mysql:
    image: mysql:8.0
    container_name: mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: testdb
      MYSQL_USER: admin
      MYSQL_PASSWORD: admin123
      MYSQL_USER_PRIVILEGES: ALL
      TZ: Asia/Shanghai
    ports:
      - "3306:3306"
    volumes:
      - ./data:/var/lib/mysql
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    networks:
      - mysql_network

networks:
  mysql_network:
    driver: bridge
```
```yml [docker-swarm.yml]
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: testdb
      MYSQL_USER: admin
      MYSQL_PASSWORD: admin123
      MYSQL_USER_PRIVILEGES: ALL
      TZ: Asia/Shanghai
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
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
  mysql_data:
    driver: local
```
:::
:::tip 提示
- 配置中默认使用`MySQL`的`主从复制`模式，以便支持`高可用性`
- 如果使用`docker-swarm`，运行前请先确认`swarm_network`网络是否存在
  - 创建`swarm_network`网络命令：docker network create --driver overlay --attachable swarm_network
  - 运行`docker-swarm.yml`命令：docker stack deploy -c docker-swarm.yml mysql
:::
