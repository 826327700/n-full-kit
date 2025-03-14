/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface User {
  /** 用户名 */
  username: string;
  /** 用户角色 */
  role: string;
  /**
   * 创建时间
   * @format date-time
   */
  createdAt: string;
  /**
   * 更新时间
   * @format date-time
   */
  updatedAt: string;
}

export interface CreateUserDto {
  /**
   * 用户名
   * @minLength 4
   * @maxLength 20
   * @uniqueItems true
   * @example "johndoe"
   */
  username: string;
  /**
   * 密码
   * @format password
   * @minLength 6
   * @maxLength 20
   * @example "Password123"
   */
  password: string;
}

export interface LoginDto {
  /**
   * 用户名
   * @minLength 4
   * @maxLength 20
   * @example "johndoe"
   */
  username: string;
  /**
   * 密码
   * @format password
   * @minLength 6
   * @maxLength 20
   * @example "Password123"
   */
  password: string;
}

export interface PageQueryResUser {
  /** 数据列表 */
  list: User[];
  /** 总数量 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}

export interface UpdateUserDto {
  /**
   * 用户名
   * @minLength 4
   * @maxLength 20
   * @uniqueItems true
   * @example "johndoe"
   */
  username?: string;
  /**
   * 密码
   * @format password
   * @minLength 6
   * @maxLength 20
   * @example "Password123"
   */
  password?: string;
}

export interface SetStringDto {
  /** 键 */
  key: string;
  /** 值 */
  value: string;
  /** 过期时间（秒） */
  ttl?: number;
}

export interface SetHashDto {
  /** 键 */
  key: string;
  /** 字段 */
  field: string;
  /** 值 */
  value: string;
}

export interface SetValueDto {
  /** 键 */
  key: string;
  /** 值 */
  value: string;
}

export interface UserInfo {
  /** 用户id */
  id: string;
  /** 用户昵称 */
  nickname: string;
  /** 用户菜单name */
  menus: string[];
  /** 用户权限key */
  permissions: string[];
}

export interface LoginAdminUserResDto {
  /** token */
  access_token: string;
  /** 用户信息 */
  user: UserInfo;
}

export interface LoginAdminUserDto {
  /**
   * 用户名
   * @example "root"
   */
  username: string;
  /**
   * 密码
   * @example "root123"
   */
  password: string;
}

export interface CreateAdminUserDto {
  /**
   * 用户昵称
   * @example "小包子"
   */
  nickname: string;
  /**
   * 用户名
   * @example "admin"
   */
  username: string;
  /**
   * 密码
   * @example "admin123"
   */
  password: string;
  /**
   * 用户绑定角色id，可绑定多个
   * @example []
   */
  roles: string[];
  /**
   * 用户状态
   * @default "0"
   * @example "0"
   */
  status: string;
}

export interface AdminUserRoleItem {
  /** 角色ID */
  id: string;
  /** 角色名称 */
  name: string;
  /** 角色描述 */
  description: string;
}

export interface AdminUserDto {
  /** 用户ID */
  id: string;
  /** 用户昵称 */
  nickname: string;
  /** 用户名 */
  username: string;
  /** 所属角色 */
  roles: AdminUserRoleItem[];
  /**
   * 状态
   * @example "0"
   */
  status: string;
  /**
   * 创建时间
   * @format date-time
   */
  createdAt: string;
  /**
   * 更新时间
   * @format date-time
   */
  updatedAt: string;
}

export interface PageQueryResAdminUserDto {
  /** 数据列表 */
  list: AdminUserDto[];
  /** 总数量 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}

export interface UpdateAdminUserDto {
  /**
   * 用户昵称
   * @example "小包子"
   */
  nickname: string;
  /**
   * 用户名
   * @example "admin"
   */
  username: string;
  /**
   * 密码
   * @example "admin123"
   */
  password: string;
  /**
   * 用户绑定角色id，可绑定多个
   * @example []
   */
  roles: string[];
  /**
   * 用户状态
   * @default "0"
   * @example "0"
   */
  status: string;
}

export interface CreateAdminRoleDto {
  /** 角色名称 */
  name: string;
  /** 角色描述 */
  description?: string;
  /** 角色菜单列表 */
  menus: string[];
  /** 角色权限列表 */
  permissions: string[];
  /** 角色状态 */
  status?: string;
}

export interface AdminRoleDto {
  /** 角色ID */
  id: string;
  /** 角色名称 */
  name: string;
  /** 角色描述 */
  description: string;
  /** 角色菜单列表 */
  menus: string[];
  /** 角色权限列表 */
  permissions: string[];
  /**
   * 状态
   * @example "0"
   */
  status: string;
  /**
   * 创建时间
   * @format date-time
   */
  createdAt: string;
  /**
   * 更新时间
   * @format date-time
   */
  updatedAt: string;
}

export interface PageQueryResAdminRoleDto {
  /** 数据列表 */
  list: AdminRoleDto[];
  /** 总数量 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}

export interface UpdateAdminRoleDto {
  /** 角色名称 */
  name?: string;
  /** 角色描述 */
  description?: string;
  /** 角色菜单列表 */
  menus: string[];
  /** 角色权限列表 */
  permissions: string[];
  /** 角色状态 */
  status?: string;
}

export interface AdminPermissionItemDto {
  /** 权限名 */
  key: string;
  /** 权限描述 */
  description: string;
  /** 所属分组key */
  group: string;
  /** 所属分组描述 */
  groupDescription: string;
  /** 权限状态 */
  status: string;
}

export interface AdminMenuItem {
  /** 菜单路径 */
  path: string;
  /** 菜单key */
  name: string;
  /** 菜单标题 */
  title: string;
  /** 菜单关联权限 */
  permissions: string[];
  /** 父级菜单key */
  parentName?: string;
}

export interface UpdateAdminMenusDto {
  /** 菜单列表 */
  menus: AdminMenuItem[];
}

export interface CreateAdminDictTypeDto {
  /** 字典类型标识符 */
  type: string;
  /** 字典类型显示名称 */
  typeName: string;
  /**
   * 状态：0-启用，1-禁用
   * @default "0"
   */
  status: string;
  /** 备注说明 */
  remark: string;
}

export interface AdminDictTypeDto {
  /** 字典类型id */
  id: string;
  /** 字典类型标识符 */
  type: string;
  /** 字典类型显示名称 */
  typeName: string;
  /** 状态：0-启用，1-禁用 */
  status: string;
  /** 备注说明 */
  remark: string;
  /** 来源，custom-手动添加，system-代码内置  */
  from: string;
  /**
   * 创建时间
   * @format date-time
   */
  createdAt: string;
  /**
   * 更新时间
   * @format date-time
   */
  updatedAt: string;
}

export interface PageQueryResAdminDictTypeDto {
  /** 数据列表 */
  list: AdminDictTypeDto[];
  /** 总数量 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}

export interface UpdateAdminDictTypeDto {
  /** 字典类型标识符 */
  type?: string;
  /** 字典类型显示名称 */
  typeName?: string;
  /**
   * 状态：0-启用，1-禁用
   * @default "0"
   */
  status?: string;
  /** 备注说明 */
  remark?: string;
}

export interface CreateAdminDictDto {
  /** 字典类型标识符 */
  type: string;
  /** 字典编码 */
  code: string;
  /** 显示标签 */
  label: string;
  /** 排序号 */
  sort: number;
  /**
   * 状态：0-启用，1-禁用
   * @default "0"
   */
  status: string;
  /** 备注说明 */
  remark: string;
}

export interface AdminDictDto {
  /** 字典类型标识符 */
  type: string;
  /** 字典编码 */
  code: string;
  /** 显示标签 */
  label: string;
  /** 排序号 */
  sort: number;
  /** 状态：0-启用，1-禁用 */
  status: string;
  /** 备注说明 */
  remark: string;
  /**
   * 创建时间
   * @format date-time
   */
  createdAt: string;
  /**
   * 更新时间
   * @format date-time
   */
  updatedAt: string;
}

export interface UpdateAdminDictDto {
  /** 字典类型标识符 */
  type?: string;
  /** 字典编码 */
  code?: string;
  /** 显示标签 */
  label?: string;
  /** 排序号 */
  sort?: number;
  /**
   * 状态：0-启用，1-禁用
   * @default "0"
   */
  status?: string;
  /** 备注说明 */
  remark?: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title NestJS API
 * @version 1.0.1
 * @contact
 *
 * 我的 NestJS API 文档
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  app = {
    /**
     * No description
     *
     * @tags app端-增删改查示例(MongoDB版)
     * @name UsersControllerCreate
     * @summary 创建用户
     * @request POST:/app/users
     * @secure
     */
    usersControllerCreate: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<
        {
          data: User;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/app/users`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags app端-增删改查示例(MongoDB版)
     * @name UsersControllerFindAll
     * @summary 分页获取用户列表
     * @request GET:/app/users
     * @secure
     */
    usersControllerFindAll: (
      query?: {
        /**
         * 页码
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @min 1
         * @default 10
         */
        pageSize?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: PageQueryResUser;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/app/users`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags app端-增删改查示例(MongoDB版)
     * @name UsersControllerLogin
     * @summary 用户登录
     * @request POST:/app/users/login
     * @secure
     */
    usersControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<
        {
          data: User;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/app/users/login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags app端-增删改查示例(MongoDB版)
     * @name UsersControllerFindOne
     * @summary 根据ID获取用户
     * @request GET:/app/users/{id}
     * @secure
     */
    usersControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          data: User;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/app/users/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags app端-增删改查示例(MongoDB版)
     * @name UsersControllerUpdate
     * @summary 根据ID更新用户
     * @request PATCH:/app/users/{id}
     * @secure
     */
    usersControllerUpdate: (id: string, data: UpdateUserDto, params: RequestParams = {}) =>
      this.request<
        {
          data: User;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/app/users/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags app端-增删改查示例(MongoDB版)
     * @name UsersControllerRemove
     * @summary 根据ID删除用户
     * @request DELETE:/app/users/{id}
     * @secure
     */
    usersControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          data: User;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/app/users/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 错误拦截用法示例
     * @name ErrorExampleControllerTestHttpError
     * @summary 测试 HTTP 异常
     * @request GET:/app/error-example/test-http-error
     */
    errorExampleControllerTestHttpError: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/app/error-example/test-http-error`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 错误拦截用法示例
     * @name ErrorExampleControllerTestProgramError
     * @summary 测试程序错误
     * @request GET:/app/error-example/test-program-error
     */
    errorExampleControllerTestProgramError: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/app/error-example/test-program-error`,
        method: "GET",
        ...params,
      }),
  };
  redisExample = {
    /**
     * No description
     *
     * @tags Redis用法示例
     * @name RedisExampleControllerTestCache
     * @summary 缓存http请求，首次请求3秒才返回数据，之后缓存60秒
     * @request GET:/redis-example/test-cache
     */
    redisExampleControllerTestCache: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/redis-example/test-cache`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Redis用法示例
     * @name RedisExampleControllerTestCacheCustomKey
     * @summary 自定义缓存key来缓存http请求，首次请求3秒才返回数据，之后缓存60秒（本例：缓存key为用户ID）
     * @request GET:/redis-example/test-cache-custom-key
     */
    redisExampleControllerTestCacheCustomKey: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/redis-example/test-cache-custom-key`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Redis用法示例
     * @name RedisExampleControllerRemoveCache
     * @summary 清除所有http缓存
     * @request POST:/redis-example/remove-cache
     */
    redisExampleControllerRemoveCache: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/redis-example/remove-cache`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Redis用法示例
     * @name RedisExampleControllerRemoveCacheByKey
     * @summary 清除指定http缓存
     * @request POST:/redis-example/remove-cache-key/{key}
     */
    redisExampleControllerRemoveCacheByKey: (key: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/redis-example/remove-cache-key/${key}`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Redis用法示例
     * @name RedisExampleControllerSetString
     * @summary 设置字符串值
     * @request POST:/redis-example/string
     */
    redisExampleControllerSetString: (data: SetStringDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/redis-example/string`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Redis用法示例
     * @name RedisExampleControllerGetString
     * @summary 获取字符串值
     * @request GET:/redis-example/string/{key}
     */
    redisExampleControllerGetString: (key: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/redis-example/string/${key}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Redis用法示例
     * @name RedisExampleControllerSetHash
     * @summary 设置哈希表字段
     * @request POST:/redis-example/hash
     */
    redisExampleControllerSetHash: (data: SetHashDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/redis-example/hash`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Redis用法示例
     * @name RedisExampleControllerGetHash
     * @summary 获取哈希表所有字段
     * @request GET:/redis-example/hash/{key}
     */
    redisExampleControllerGetHash: (key: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/redis-example/hash/${key}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Redis用法示例
     * @name RedisExampleControllerPushList
     * @summary 向列表添加元素
     * @request POST:/redis-example/list
     */
    redisExampleControllerPushList: (data: SetValueDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/redis-example/list`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Redis用法示例
     * @name RedisExampleControllerGetList
     * @summary 获取列表所有元素
     * @request GET:/redis-example/list/{key}
     */
    redisExampleControllerGetList: (key: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/redis-example/list/${key}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Redis用法示例
     * @name RedisExampleControllerAddToSet
     * @summary 向集合添加元素
     * @request POST:/redis-example/set
     */
    redisExampleControllerAddToSet: (data: SetValueDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/redis-example/set`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Redis用法示例
     * @name RedisExampleControllerGetSet
     * @summary 获取集合所有元素
     * @request GET:/redis-example/set/{key}
     */
    redisExampleControllerGetSet: (key: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/redis-example/set/${key}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Redis用法示例
     * @name RedisExampleControllerDelete
     * @summary 删除键
     * @request DELETE:/redis-example/{key}
     */
    redisExampleControllerDelete: (key: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/redis-example/${key}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Redis用法示例
     * @name RedisExampleControllerGetTtl
     * @summary 获取键的剩余生存时间
     * @request GET:/redis-example/ttl/{key}
     */
    redisExampleControllerGetTtl: (key: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/redis-example/ttl/${key}`,
        method: "GET",
        ...params,
      }),
  };
  rateLimit = {
    /**
     * No description
     *
     * @tags 限流用法示例
     * @name RateLimitControllerGetDefaultLimit
     * @summary 全局默认限流配置，请连续请求10次测试
     * @request GET:/rate-limit/default
     */
    rateLimitControllerGetDefaultLimit: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/rate-limit/default`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 限流用法示例
     * @name RateLimitControllerGetStrictLimit
     * @summary 自定义限流配置，1分钟最多3次请求，请连续请求3次测试
     * @request GET:/rate-limit/strict
     */
    rateLimitControllerGetStrictLimit: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/rate-limit/strict`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 限流用法示例
     * @name RateLimitControllerGetNoLimit
     * @summary 不启用限流
     * @request GET:/rate-limit/no-limit
     */
    rateLimitControllerGetNoLimit: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/rate-limit/no-limit`,
        method: "GET",
        ...params,
      }),
  };
  admin = {
    /**
     * No description
     *
     * @tags admin端-管理员用户
     * @name AdminUsersControllerCreateRoot
     * @summary 创建超级管理员
     * @request POST:/admin/users/root
     * @secure
     */
    adminUsersControllerCreateRoot: (params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          data: string;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/users/root`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-管理员用户
     * @name AdminUsersControllerLogin
     * @summary 管理员登录
     * @request POST:/admin/users/login
     * @secure
     */
    adminUsersControllerLogin: (data: LoginAdminUserDto, params: RequestParams = {}) =>
      this.request<
        {
          data: LoginAdminUserResDto;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/users/login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-管理员用户
     * @name AdminUsersControllerGetLoginInfo
     * @summary 获取管理员登录信息
     * @request GET:/admin/users/login-info
     * @secure
     */
    adminUsersControllerGetLoginInfo: (params: RequestParams = {}) =>
      this.request<
        {
          data: UserInfo;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/users/login-info`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-管理员用户
     * @name AdminUsersControllerCreate
     * @summary 创建新管理员用户
     * @request POST:/admin/users
     * @secure
     */
    adminUsersControllerCreate: (data: CreateAdminUserDto, params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          data: string;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/users`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-管理员用户
     * @name AdminUsersControllerFindAll
     * @summary 获取所有管理员用户
     * @request GET:/admin/users
     * @secure
     */
    adminUsersControllerFindAll: (
      query?: {
        /**
         * 页码
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @min 1
         * @default 10
         */
        pageSize?: number;
        /** 搜索关键词 */
        keyword?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: PageQueryResAdminUserDto;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/users`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-管理员用户
     * @name AdminUsersControllerFindOne
     * @summary 根据ID获取管理员用户
     * @request GET:/admin/users/{id}
     * @secure
     */
    adminUsersControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          data: AdminUserDto;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/users/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-管理员用户
     * @name AdminUsersControllerUpdate
     * @summary 更新管理员用户信息
     * @request PATCH:/admin/users/{id}
     * @secure
     */
    adminUsersControllerUpdate: (id: string, data: UpdateAdminUserDto, params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          data: string;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/users/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-管理员用户
     * @name AdminUsersControllerRemove
     * @summary 删除管理员用户
     * @request DELETE:/admin/users/{id}
     * @secure
     */
    adminUsersControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          data: string;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/users/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-管理员角色
     * @name AdminRolesControllerCreate
     * @summary 创建新管理员角色
     * @request POST:/admin/roles
     * @secure
     */
    adminRolesControllerCreate: (data: CreateAdminRoleDto, params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          data: string;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/roles`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-管理员角色
     * @name AdminRolesControllerFindAll
     * @summary 获取所有管理员角色
     * @request GET:/admin/roles
     * @secure
     */
    adminRolesControllerFindAll: (
      query?: {
        /**
         * 页码
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @min 1
         * @default 10
         */
        pageSize?: number;
        /** 搜索关键词 */
        keyword?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: PageQueryResAdminRoleDto;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/roles`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-管理员角色
     * @name AdminRolesControllerFindOne
     * @summary 根据ID获取管理员角色
     * @request GET:/admin/roles/role/{id}
     * @secure
     */
    adminRolesControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          data: AdminRoleDto;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/roles/role/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-管理员角色
     * @name AdminRolesControllerUpdate
     * @summary 更新管理员角色信息
     * @request PATCH:/admin/roles/role/{id}
     * @secure
     */
    adminRolesControllerUpdate: (id: string, data: UpdateAdminRoleDto, params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          data: string;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/roles/role/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-管理员角色
     * @name AdminRolesControllerRemove
     * @summary 删除管理员角色
     * @request DELETE:/admin/roles/role/{id}
     * @secure
     */
    adminRolesControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          data: string;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/roles/role/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-管理员角色
     * @name AdminRolesControllerFindAllPermissions
     * @summary 获取所有可选权限
     * @request GET:/admin/roles/permissions
     * @secure
     */
    adminRolesControllerFindAllPermissions: (params: RequestParams = {}) =>
      this.request<
        {
          data: AdminPermissionItemDto[];
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/roles/permissions`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-管理员角色
     * @name AdminRolesControllerUpdateAllMenus
     * @summary 更新所有菜单
     * @request POST:/admin/roles/menus
     * @secure
     */
    adminRolesControllerUpdateAllMenus: (data: UpdateAdminMenusDto, params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          data: string;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/roles/menus`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-管理员角色
     * @name AdminRolesControllerFindAllMenus
     * @summary 获取所有菜单
     * @request GET:/admin/roles/menus
     * @secure
     */
    adminRolesControllerFindAllMenus: (params: RequestParams = {}) =>
      this.request<
        {
          data: AdminMenuItem[];
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/roles/menus`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-字典管理
     * @name AdminDictControllerCreateType
     * @summary 创建字典类型
     * @request POST:/admin/dict/type
     * @secure
     */
    adminDictControllerCreateType: (data: CreateAdminDictTypeDto, params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          data: string;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/dict/type`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-字典管理
     * @name AdminDictControllerFindAllTypes
     * @summary 查询字典类型列表
     * @request GET:/admin/dict/type
     * @secure
     */
    adminDictControllerFindAllTypes: (
      query?: {
        /**
         * 页码
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * 每页数量
         * @min 1
         * @default 10
         */
        pageSize?: number;
        /** 搜索关键词 */
        keyword?: string;
        /** 状态：0-启用，1-禁用 */
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: PageQueryResAdminDictTypeDto;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/dict/type`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-字典管理
     * @name AdminDictControllerUpdateType
     * @summary 更新字典类型
     * @request PATCH:/admin/dict/type/{type}
     * @secure
     */
    adminDictControllerUpdateType: (type: string, data: UpdateAdminDictTypeDto, params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          data: string;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/dict/type/${type}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-字典管理
     * @name AdminDictControllerRemoveType
     * @summary 删除字典类型
     * @request DELETE:/admin/dict/type/{type}
     * @secure
     */
    adminDictControllerRemoveType: (type: string, params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          data: string;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/dict/type/${type}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-字典管理
     * @name AdminDictControllerCreate
     * @summary 创建字典项
     * @request POST:/admin/dict
     * @secure
     */
    adminDictControllerCreate: (data: CreateAdminDictDto, params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          data: string;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/dict`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-字典管理
     * @name AdminDictControllerFindByType
     * @summary 根据类型获取字典项
     * @request GET:/admin/dict/items/{type}
     * @secure
     */
    adminDictControllerFindByType: (type: string, params: RequestParams = {}) =>
      this.request<
        {
          data: AdminDictDto[];
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/dict/items/${type}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-字典管理
     * @name AdminDictControllerUpdate
     * @summary 更新字典项
     * @request PATCH:/admin/dict/{type}/{code}
     * @secure
     */
    adminDictControllerUpdate: (type: string, code: string, data: UpdateAdminDictDto, params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          data: string;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/dict/${type}/${code}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin端-字典管理
     * @name AdminDictControllerRemove
     * @summary 删除字典项
     * @request DELETE:/admin/dict/{type}/{code}
     * @secure
     */
    adminDictControllerRemove: (type: string, code: string, params: RequestParams = {}) =>
      this.request<
        {
          /** @example "ok" */
          data: string;
          /** @example 0 */
          code: number;
          /** @example "请求成功" */
          message: string;
        },
        void
      >({
        path: `/admin/dict/${type}/${code}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
