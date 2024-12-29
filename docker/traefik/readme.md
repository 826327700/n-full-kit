# Traefik + Grafana + Prometheus + Consul Stack

## 介绍

本项目使用 Docker Compose 和 Docker Swarm 启动一套基于 Traefik、Grafana、Prometheus 和 Consul 的监控与服务代理架构。该架构包括以下服务：

- **Traefik**：反向代理和负载均衡，负责处理 HTTP(S) 请求并将其转发到后端服务。
- **Grafana**：可视化仪表盘，用于显示 Prometheus 收集的指标数据。
- **Prometheus**：用于采集和存储服务的监控数据。
- **Consul**：服务发现和配置管理工具。

## 启动服务

### 1. 使用 Docker Swarm 部署

此架构已基于 Docker Swarm 配置，可以在 Docker Swarm 集群中部署。

#### 1.1 配置 `docker-compose.yml`

确保你已经在项目根目录下创建了 `docker-compose.yml` 文件，并根据你的需要配置了 Traefik、Grafana、Prometheus 和 Consul 服务。

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
    container_name: traefik
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
      - ./config/config.yml:/etc/traefik/config.yml
      - ./certs:/etc/certs
      - ./logs:/var/log/traefik
    networks:
      - traefik_net
    labels:
      - "traefik.enable=true"

  grafana:
    image: grafana/grafana:latest
    deploy:
      replicas: 1
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin # Grafana 管理员密码
    ports:
      - "3000:3000"
    networks:
      - traefik_net

  prometheus:
    image: prom/prometheus:latest
    deploy:
      replicas: 1
    volumes:
      - ./config/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
    networks:
      - traefik_net

  consul:
    image: hashicorp/consul
    deploy:
      replicas: 1
    environment:
      - CONSUL_LOCAL_CONFIG={"acl":{"enabled":true,"default_policy":"allow","enable_token_persistence":true,"tokens":{"master":"admin","agent":"admin"}}}
    ports:
      - "8500:8500"  # Consul UI
      - "8600:8600"  # DNS
    volumes:
      - ./consul/data:/consul/data
    networks:
      - traefik_net

networks:
  traefik_net:
    external: true
```

### 1.2 启动服务

确保你已经设置好 Docker Swarm 环境。然后，在终端运行以下命令启动服务：

```bash
docker stack deploy -c docker-compose.yml traefik_stack
```
这会启动所有配置的服务，并将其部署到 Docker Swarm 集群中。

### 1.3 配置文件说明

- `Traefik`：在 ./config/traefik.yml 和 ./config/config.yml 配置文件中配置 Traefik 的路由规则和服务发现。

- `Prometheus`：在 ./config/prometheus.yml 配置文件中配置 Prometheus 要采集的服务和目标。

- `Consul`：在 ./consul/data 中存储 Consul 的数据。

### 2. 配置认证

#### 2.1 Traefik

如果你希望为 Traefik 的 Web UI (Dashboard) 配置认证，编辑 config/config.yml 文件，并启用基本认证：

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

Grafana 的管理员密码在 docker-compose.yml 文件中配置：

```yaml
  grafana:
    image: grafana/grafana:latest
    deploy:
      replicas: 1
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin # Grafana 管理员密码
    ports:
      - "3000:3000"
    networks:
      - traefik_net
```
如果你想要更改 Grafana 的用户名或密码，可以修改此配置。

#### 2.3 Consul

在 docker-compose.yml 中，已为 Consul 配置了默认的 ACL 令牌：

```yaml
  consul:
    image: hashicorp/consul
    deploy:
      replicas: 1
    environment:
      - CONSUL_LOCAL_CONFIG={"acl":{"enabled":true,"default_policy":"allow","enable_token_persistence":true,"tokens":{"master":"admin","agent":"admin"}}}
    ports:
      - "8500:8500"  # Consul UI
      - "8600:8600"  # DNS
    volumes:
      - ./consul/data:/consul/data
    networks:
      - traefik_net
```
默认配置中，master 和 agent 令牌的密码均为 admin。如果需要修改密码或权限，可以在 Consul 的配置文件中进行修改，或者在 UI 中设置。

#### 2.4 Prometheus   
Prometheus 不需要专门的认证配置。如果你希望为 Prometheus 配置认证，可以在 prometheus.yml 中配置反向代理来启用基本认证。

### 3. 访问服务
- `Traefik Dashboard`: 访问 http://localhost:8080，默认用户名和密码均为 admin。
- `Grafana`: 访问 http://localhost:3000，默认管理员密码是你在 docker-compose.yml 中设置的（例如 admin）。
- `Consul UI`: 访问 http://localhost:8500，默认master 和 agent 令牌的密码均为 admin。