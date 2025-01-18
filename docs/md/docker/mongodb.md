---
outline: deep
lang: zh-CN
---

# MongoDB

## 概述
MongoDB 是一个基于分布式文件存储的开源 NoSQL 数据库。与传统的关系型数据库相比，MongoDB 具有以下特点：

- **文档存储**：数据以 BSON（类似 JSON）格式存储，结构灵活
- **高性能**：支持索引、聚合等操作，查询效率高
- **高可用性**：支持副本集和分片集群，保证数据可靠性
- **水平扩展**：通过分片实现数据分布式存储，支持海量数据
- **丰富的查询语言**：支持丰富的查询表达式和聚合管道

MongoDB 适用于以下场景：
- 需要灵活数据模型的应用程序
- 需要处理大量非结构化或半结构化数据
- 需要高吞吐量和低延迟的实时应用
- 需要水平扩展的大数据应用

## 快速部署
本项目的`n-full-cli`提供`MongoDB`的docker部署配置样板文件。
1. 在准备存放项目的目录下，使用`n-full-cli`工具输入命令创建：
2. 输入命令：`nfull docker`
3. 选择：`MongoDB`
4. 选择：`docker-compose`或者`docker-swarm`（根据自己的docker模式选择）

```sh:no-line-numbers{4,10}
T  nfull docker
|
o  ? Please select the configuration you want to pop up / 请选择想要弹出的配置
|  ❯ MongoDB 
|    MySQL 
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
  mongodb:
    image: mongo:latest
    container_name: mongodb
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
    ports:
      - "27017:27017"
    volumes:
      - ./data:/data/db
      - ./mongo-keyfile:/data/keyfile/mongo-keyfile
    command: mongod --auth --replSet rs0 --keyFile /data/keyfile/mongo-keyfile --bind_ip_all
    networks:
      - mongo_network

networks:
  mongo_network:
    driver: bridge

```
```yml [docker-swarm.yml]
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    secrets:
      - mongo-keyfile
    command: mongod --auth --replSet rs0 --keyFile /run/secrets/mongo-keyfile --bind_ip_all
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
    
secrets:
  mongo-keyfile:
    external: true

volumes:
  mongodb_data:
    driver: local

```
:::

### 启动
启动docker前需要先创建`mongo-keyfile`密钥文件，在`docker-compose.yml`或者`docker-swarm.yml`同级目录下：
```sh
# 创建密钥文件
openssl rand -base64 756 > ./mongo-keyfile
# 设置权限
chmod 600 ./mongo-keyfile

# 启动mongodb
docker compose up -d
```
如果使用`docker-swarm`，在创建将`mongo-keyfile`密钥文件之后，还需要将`mongo-keyfile`文件创建为`Docker Secret`:
```sh
# 创建密钥文件
openssl rand -base64 756 > ./mongo-keyfile
# 设置权限
chmod 600 ./mongo-keyfile
# 将 mongo-keyfile 文件创建为 Docker Secret
docker secret create mongo-keyfile ./mongo-keyfile

# 启动mongodb
docker stack deploy -c docker-swarm.yml mongo_stack
```

### 初始化副本集
首次启动需要初始化副本集：
```sh
# 使用mongosh工具连接到数据库
> mongosh "mongodb://admin:admin123@localhost:27017/?authSource=admin"

# 初始化副本集
> rs.initiate({
  _id: 'rs0',
  members: [
    {
      _id: 0,
      host: 'localhost:27017'
    }
  ]
})
```
`mongosh`工具安装：[mongodb-shell](https://www.mongodb.com/zh-cn/docs/mongodb-shell/install/)

:::tip 提示
- 配置中默认使用`MongoDB`的`副本集`模式，以便支持`数据库事务`
- 如果使用`docker-swarm`，运行前请先确认`swarm_network`网络是否存在
  - 创建`swarm_network`网络命令：docker network create --driver overlay --attachable swarm_network
  - 运行`docker-swarm.yml`命令：docker stack deploy -c docker-swarm.yml mongodb
:::