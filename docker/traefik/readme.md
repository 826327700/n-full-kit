# Traefik + Grafana + Prometheus + Consul + Loki + Promtail Stack

## 介绍

本项目使用 Docker Compose 和 Docker Swarm 启动一套基于 Traefik、Grafana、Prometheus、Consul、Loki 和 Promtail 的监控与服务代理架构。该架构包括以下服务：

- **Traefik**：反向代理和负载均衡，负责处理 HTTP(S) 请求并将其转发到后端服务。
- **Grafana**：可视化仪表盘，用于显示 Prometheus 收集的指标数据。
- **Prometheus**：用于采集和存储服务的监控数据。
- **Consul**：服务发现和配置管理工具。
- **Loki**：日志聚合系统，用于收集和存储日志数据。
- **Promtail**：日志收集代理，用于将日志数据发送到 Loki。

## 启动服务

### 1. 使用 Docker Swarm 部署

此架构已基于 Docker Swarm 配置，可以在 Docker Swarm 集群中部署。

#### 1.1 配置 `docker-swarm.yml`

确保你已经在项目根目录下创建了 `docker-swarm.yml` 文件，并根据你的需要配置了 Traefik、Grafana、Prometheus、Consul、Loki 和 Promtail 服务。

```yaml
version: '3.9'

services:
  traefik:
    image: traefik:v3.0
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    ports:
      - "80:80"     # HTTP
      - "443:443"   # HTTPS
      - "8080:8080" # Dashboard
      - "8082:8082" # metrics
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "20"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./config/traefik.yml:/etc/traefik/traefik.yml
      - ./config/vhost:/etc/traefik/vhost
      - ./certs:/etc/certs
      - ./logs:/var/log/traefik
      - ./acme/acme.json:/etc/traefik/acme.json
    networks:
      - swarm_network
    labels:
      - "traefik.enable=true"

  grafana:
    image: grafana/grafana:latest
    deploy:
      replicas: 1
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    ports:
      - "3000:3000"
    volumes:
      - grafana-storage:/var/lib/grafana  # 添加卷挂载
    networks:
      - swarm_network

  prometheus: #推荐grafana面板导入id=17035/4475
    image: prom/prometheus:latest
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
    volumes:
      - ./config/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-storage:/prometheus  # 数据持久化挂载
    ports:
      - "9090:9090"
    networks:
      - swarm_network

  consul:
    image: hashicorp/consul
    deploy:
      replicas: 1
    environment:
      - CONSUL_LOCAL_CONFIG={"acl":{"enabled":true,"default_policy":"deny","enable_token_persistence":true,"tokens":{"master":"admin","agent":"admin"}}}
    command: agent -server -bootstrap-expect=1 -client=0.0.0.0 -ui -bind=127.0.0.1
    ports:
      - "8500:8500"  # Consul UI
      - "8600:8600"  # DNS
    volumes:
      - consul-data:/consul/data
    networks:
      - swarm_network

  loki:
    image: grafana/loki:latest
    container_name: loki
    restart: unless-stopped
    deploy:
      replicas: 1  # Swarm 模式下设置副本数
      placement:
        constraints:
          - node.role == manager  # 使 Loki 运行在 Swarm Manager 节点上
    ports:
      - "3100:3100"  # Loki API端口
    volumes:
      - loki-data:/data/loki  # 持久化存储 Loki 数据
      - ./loki/config.yaml:/etc/loki/loki-config.yaml  # Loki 配置文件挂载
    networks:
      - swarm_network

  promtail:
    image: grafana/promtail:latest
    container_name: promtail
    restart: unless-stopped
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager  # 使 Promtail 运行在 Swarm Manager 节点上
    volumes:
      - ./promtail/config.yml:/etc/promtail/config.yml  # Promtail 配置文件挂载
      - ./logs:/var/log/traefik  # Traefik 日志目录挂载
    networks:
      - swarm_network

networks:
  swarm_network:
    external: true

volumes:
  consul-data:
  grafana-storage:
  prometheus-storage:
  loki-data:
```

### 1.2 启动服务

确保你已经设置好 Docker Swarm 环境。然后，在终端运行以下命令启动服务：

```bash
docker network create -d overlay swarm_network // 创建 名为swarm_network 的overlay 网络
docker stack deploy -c docker-swarm.yml traefik_stack
```
这会启动所有配置的服务，并将其部署到 Docker Swarm 集群中。

### 1.3 配置文件说明

- `Traefik`：在 ./config/traefik.yml 和 ./config/vhost/config.yml 配置文件中配置 Traefik 的路由规则和服务发现。
- `Prometheus`：在 ./config/prometheus.yml 配置文件中配置 Prometheus 要采集的服务和目标。
- `Loki`：在 ./loki/config.yaml 配置文件中配置 Loki 的存储和日志收集规则。
- `Promtail`：在 ./promtail/config.yml 配置文件中配置 Promtail 的日志收集规则。

### 2. 配置认证

#### 2.1 Traefik

如果你希望为 Traefik 的 Web UI (Dashboard) 配置认证，编辑 config/vhost/config.yml 文件，并启用基本认证：

```yaml
#... 10-14行
    auth:
      basicAuth:
        users:
          - "admin:$apr1$lrta7Zzl$.GiLJOz0/gSKS.Tl/tY1a/" # 格式为 username:password 用 htpasswd 生成加密的密码 示例：htpasswd -nb admin password
        removeHeader: true
#...
```

#### 2.2 Grafana

Grafana 的管理员密码在 docker-swarm.yml 文件中配置：

```yaml
  grafana:
    image: grafana/grafana:latest
    deploy:
      replicas: 1
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    ports:
      - "3000:3000"
    volumes:
      - grafana-storage:/var/lib/grafana  # 添加卷挂载
    networks:
      - swarm_network
```
如果你想要更改 Grafana 的用户名或密码，可以修改此配置。

#### 2.3 Consul

在 docker-swarm.yml 中，已为 Consul 配置了默认的 ACL 令牌：

```yaml
  consul:
    image: hashicorp/consul
    deploy:
      replicas: 1
    environment:
      - CONSUL_LOCAL_CONFIG={"acl":{"enabled":true,"default_policy":"deny","enable_token_persistence":true,"tokens":{"master":"admin","agent":"admin"}}}
    command: agent -server -bootstrap-expect=1 -client=0.0.0.0 -ui -bind=127.0.0.1
    ports:
      - "8500:8500"  # Consul UI
      - "8600:8600"  # DNS
    volumes:
      - consul-data:/consul/data
    networks:
      - swarm_network
```
默认配置中，master 和 agent 令牌的密码均为 admin。如果需要修改密码或权限，可以在 Consul 的配置文件中进行修改，或者在 UI 中设置。

#### 2.4 Prometheus   
Prometheus 不需要专门的认证配置。如果你希望为 Prometheus 配置认证，可以在 traefik 中配置反向代理来启用基本认证。

### 3. 访问服务
- `Traefik Dashboard`: 访问 http://localhost:8080，默认用户名和密码均为 admin。
- `Grafana`: 访问 http://localhost:3000，默认管理员密码是你在 docker-swarm.yml 中设置的（例如 admin）。
- `Consul UI`: 访问 http://localhost:8500，默认master 和 agent 令牌的密码均为 admin。
- `Loki API`: 访问 http://localhost:3100。