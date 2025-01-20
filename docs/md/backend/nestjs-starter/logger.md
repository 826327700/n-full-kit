---
outline: deep
---

# 日志输出

## 概述
日志系统是应用程序中不可或缺的组成部分，它能帮助开发人员了解应用程序的运行状态、排查问题和监控系统性能。

本项目使用 [Winston](https://github.com/winstonjs/winston) 作为日志框架，它是 Node.js 最流行的日志库之一，具有以下优势：

- 支持多种传输方式（文件、控制台、HTTP等）
- 支持自定义日志格式
- 提供日志分割功能
- 可扩展的插件系统
- 高性能的异步日志写入

注：本项目内封装的`Winston`不会覆盖`Nest`的默认`logger`，仅在显式调用`WinstonLoggerService`时使用`Winston`。
> [!NOTE] 参考
> - [Winston官方文档](https://github.com/winstonjs/winston)
> - [winston-daily-rotate-file](https://github.com/winstonjs/winston-daily-rotate-file)
> - [winston-loki](https://github.com/JaniAnttonen/winston-loki)

## 封装逻辑
在`src/common/logger`目录下封装了`Winston`的日志服务逻辑，并将`WinstonLoggerService`导出为全局的提供者：

### 目录结构
```
src/common/logger/
├── logger.module.ts       # 日志模块定义
├── winston.config.ts      # Winston配置
└── winston.service.ts     # Winston服务实现
```

### 配置说明
`winston.config.ts`中定义了Winston的核心配置：

1. 日志文件分类：
   - `logs/request/%DATE%.log` - 记录普通请求日志
   - `logs/error/%DATE%.log` - 记录错误日志
   - `logs/other/%DATE%.log` - 记录其他手动调用的输出日志（如info、warn、debug、verbose）

2. 日志文件特性：
   - 按日期自动分割（每天一个文件）
   - 超过指定大小（20MB）自动分割
   - 自动压缩存档
   - 保留14天的日志文件

3. 日志格式定制：
   - 包含时间戳
   - 日志级别
   - 消息内容
   - 额外元数据（JSON格式，2空格缩进）

4. Loki支持（可选）：
   - 通过环境配置开启/关闭
   - 支持将日志推送到Grafana Loki
   - 自动处理连接错误

   相关环境配置项(`.env.development`)：
   ```bash
   # Loki日志配置
   LOKI_ENABLED=false    # 是否启用Loki日志推送
   LOKI_HOST=localhost:3100   # Loki服务器地址含端口
   LOKI_BASIC_AUTH=     # Loki认证信息 没有认证则留空
   ```
   
   > [!TIP]
   > - 默认不启用Loki日志推送
   > - 如需使用，请确保已正确部署Grafana Loki服务
   > - 生产环境请修改为实际的Loki服务地址

### 服务实现
`winston.service.ts`实现了`LoggerService`接口，提供以下日志级别：

- `log()` - 信息日志
- `error()` - 错误日志
- `warn()` - 警告日志
- `debug()` - 调试日志
- `verbose()` - 详细日志
- `request()` - 请求日志

每个方法都支持传入额外的元数据。

### 默认调用
- 在所有`成功请求`时，将会在拦截器中默认调用`request()`，日志存放在`logs/request/%DATE%.log`。   
- 在所有`错误请求`或者`发生内部错误`时，将会默认调用`error()`，日志存放在`logs/error/%DATE%.log`。   

### 全局注册
`logger.module.ts`使用`@Global()`装饰器将日志服务注册为全局模块：

```ts
@Global()
@Module({
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class LoggerModule {}
```

这样其他模块无需重复导入，直接注入即可使用。

> [!TIP]
> - 日志文件默认保存在项目根目录的`logs`文件夹下
> - 建议在`.gitignore`中添加`logs`目录
> - 生产环境部署时注意配置日志目录的读写权限