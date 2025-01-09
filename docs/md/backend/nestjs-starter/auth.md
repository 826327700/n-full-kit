---
outline: deep
---

# 身份认证

## JWT
> [!NOTE] 参考
> - <a href="https://jwt.io" target="_blank">JWT官方文档</a>   
> - <a href="https://jwt.p2hp.com/" target="_blank">JWT中文镜像站</a>  


本项目模板仅内置了基于`JWT`的身份认证方式，如有其他需要，请自行添加其他认证方式，[参考文档](https://docs.nestjs.com/recipes/passport)。

本项目模板的JWT认证模块位于`src/common/modules/auth`目录：
```
src/common/modules/auth
├── auth.module.ts  // 在 root.module.ts 中导入了该模块
├── auth.service.ts
└── strategies
    └── jwt.strategy.ts
```
文件说明：
- `auth.module.ts` 模块导入导出
- `auth.service.ts` auth模块的对外提供方法
- `strategies` 策略目录
  - `jwt.strategy.ts` jwt策略逻辑
  
## 策略逻辑
基于上一节的`业务端点`中的示例，本项目模板初始内置了两个端点大分类，即`admin`和`app`，根据它们的用户来划分：
- `admin` 提供给admin后台管理的接口
- `app` 提供给前台应用程序的接口   

由此产生一个需求：`admin`分类下的接口身份验证与`app`分类下的接口身份验证不能使用同一个`策略`，否则会产生`发放给app的jwt令牌可以用来访问admin的接口`的问题。   
因此，在`jwt.strategy.ts`中设置了两个`jwt策略`：
```ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**当前JWT策略列表 */
export const JwtStrategys={
	app:{
		name:'app-jwt',
		secretOrKeyPath:'jwt.app.secret',//这里填写的是configService获取配置信息的key
		expiresInPath:'jwt.app.expiresIn',//这里填写的是configService获取配置信息的key
	},
	admin:{
		name:'admin-jwt',
		secretOrKeyPath:'jwt.admin.secret',//这里填写的是configService获取配置信息的key
		expiresInPath:'jwt.admin.expiresIn',//这里填写的是configService获取配置信息的key
	}
}

@Injectable()
export class AppJwtStrategy extends PassportStrategy(Strategy, JwtStrategys.app.name) {
	constructor(private configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get(JwtStrategys.app.secretOrKeyPath),
		});
	}

	async validate(payload: any) {
		if (!payload) {
			throw new UnauthorizedException('Invalid token payload');
		}
		return payload;
	}
}

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, JwtStrategys.admin.name) {
	constructor(private configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get(JwtStrategys.admin.secretOrKeyPath),
		});
	}

	async validate(payload: any) {
		if (!payload) {
			throw new UnauthorizedException('Invalid token payload');
		}
		return payload;
	}
}
```
本质上就是`策略名`和`secretKey`不一样而已。那么，如何使用上面已经配置好的`jwt策略`呢?   
按照Nest官方文档，简单来用的话，只需要在`控制器`或`方法`上添加装饰器`@UseGuards(AuthGuard('app-jwt'))`，示例：
```ts
@UseGuards(AuthGuard('app-jwt')) //app-jwt即刚才声明的策略名
@Controller()
export class AppController {

    //@UseGuards(AuthGuard('app-jwt')) 或者在方法级别添加装饰器
    hello(){}
}
```
::: tip 提示
在本项目模板中，不建议这么使用，因为本项目模板中封装了统一的`@Auth`和`@NoAuth`装饰器，它们同时具备了`RBAC`权限认证的功能(后面章节会有详细说明)。  
<small>源码：src/common/decorators/auth.decorator.ts</small>
- `@Auth(strategyName:string,checkRoles:boolean=false)`
  - `strategyName` `sting` 策略名称，也就是对应刚才我们声明的`app-jwt`和`admin-jwt`
  - `checkRoles` `boolean` 是否同时检查权限，默认false。
- `@NoAuth()` 用于排除某个接口不需要认证。
:::


示例：
```ts{2,8}
//使用JwtStrategys.admin.name避免魔术字符串，JwtStrategys变量来自jwt.strategy.ts
@Auth(JwtStrategys.admin.name, true) 
@Controller()
export class AppController {

    hello(){} //AppController的方法，都需认证

    @NoAuth() //标记了@NoAuth，hello2无需认证
    hello2(){}
}
```

## 发放凭证
一般在登录接口登录通过后发放jwt凭证：
- 通过注入位于`src/common/modules/auth/auth.module.ts`的`AuthModule`来获得`AuthService`所提供的`generateToken`方法，用于发放jwt凭证。
  
```ts
// 使用 AuthService 生成 token
const { access_token } = this.authService.generateToken({
	userId: user._id.toString(),
	roles: user.roles,
	customData: {
		username: user.username
	}
}, 'admin');
```
::: tip 提示
generateToken(payload: JWTUser, strategyName: keyof typeof JwtStrategys)
- `payload` 自定义的jwt信息对象，可根据需求修改
- `strategyName` 策略key，JwtStrategys对象中的一级key字符串
:::

## 获取凭证信息
前端拿到`access_token`之后，在请求头中携带`Authorization: Bearer <access_token>`，后端在`controller`的接口方法中通过`@Req()`装饰器获取req上下文，在`req.user`对象中就是解析后的`payload`：
```ts{5-6}
@Auth(JwtStrategys.app.name)
@Controller()
export class AppController {
	@Get('hello')
	hello(@Req() req){
		console.log(req.user)
	}
}
```