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

export interface TokenPayloadDto {
  /**
   * 用户ID
   * @example "123"
   */
  userId: object;
  /**
   * 用户角色列表
   * @example ["admin","user"]
   */
  roles?: string[];
  /**
   * 自定义数据
   * @example {"department":"IT"}
   */
  customData?: object;
}

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
  auth = {
    /**
     * No description
     *
     * @tags 认证
     * @name AuthControllerGenerateToken
     * @summary 生成JWT令牌
     * @request POST:/auth/token
     */
    authControllerGenerateToken: (data: TokenPayloadDto, params: RequestParams = {}) =>
      this.request<
        {
          /** JWT令牌 */
          access_token?: string;
        },
        any
      >({
        path: `/auth/token`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  app = {
    /**
     * No description
     *
     * @tags app端-用户相关(MySQL版)
     * @name UsersControllerCreate
     * @summary 创建用户
     * @request POST:/app/users
     * @secure
     */
    usersControllerCreate: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<
        {
          data?: User;
          /** @example 0 */
          code?: number;
          /** @example "请求成功" */
          message?: string;
        },
        any
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
     * @tags app端-用户相关(MySQL版)
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
          data?: User[];
          /** @example 0 */
          code?: number;
          /** @example "请求成功" */
          message?: string;
        },
        any
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
     * @tags app端-用户相关(MySQL版)
     * @name UsersControllerLogin
     * @summary 用户登录
     * @request POST:/app/users/login
     * @secure
     */
    usersControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<
        {
          data?: User;
          /** @example 0 */
          code?: number;
          /** @example "请求成功" */
          message?: string;
        },
        any
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
     * @tags app端-用户相关(MySQL版)
     * @name UsersControllerFindOne
     * @summary 根据ID获取用户
     * @request GET:/app/users/{id}
     * @secure
     */
    usersControllerFindOne: (id: number, params: RequestParams = {}) =>
      this.request<
        {
          data?: User;
          /** @example 0 */
          code?: number;
          /** @example "请求成功" */
          message?: string;
        },
        any
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
     * @tags app端-用户相关(MySQL版)
     * @name UsersControllerUpdate
     * @summary 根据ID更新用户
     * @request PATCH:/app/users/{id}
     * @secure
     */
    usersControllerUpdate: (id: number, data: UpdateUserDto, params: RequestParams = {}) =>
      this.request<
        {
          data?: User;
          /** @example 0 */
          code?: number;
          /** @example "请求成功" */
          message?: string;
        },
        any
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
     * @tags app端-用户相关(MySQL版)
     * @name UsersControllerRemove
     * @summary 根据ID删除用户
     * @request DELETE:/app/users/{id}
     * @secure
     */
    usersControllerRemove: (id: number, params: RequestParams = {}) =>
      this.request<
        {
          data?: User;
          /** @example 0 */
          code?: number;
          /** @example "请求成功" */
          message?: string;
        },
        any
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
     * @tags app端-用户相关(MongoDB版)
     * @name MongoUsersControllerCreate
     * @summary 创建用户
     * @request POST:/app/mongo-users
     * @secure
     */
    mongoUsersControllerCreate: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<
        {
          data?: User;
          /** @example 0 */
          code?: number;
          /** @example "请求成功" */
          message?: string;
        },
        any
      >({
        path: `/app/mongo-users`,
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
     * @tags app端-用户相关(MongoDB版)
     * @name MongoUsersControllerFindAll
     * @summary 分页获取用户列表
     * @request GET:/app/mongo-users
     * @secure
     */
    mongoUsersControllerFindAll: (
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
          data?: User[];
          /** @example 0 */
          code?: number;
          /** @example "请求成功" */
          message?: string;
        },
        any
      >({
        path: `/app/mongo-users`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags app端-用户相关(MongoDB版)
     * @name MongoUsersControllerLogin
     * @summary 用户登录
     * @request POST:/app/mongo-users/login
     * @secure
     */
    mongoUsersControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<
        {
          data?: User;
          /** @example 0 */
          code?: number;
          /** @example "请求成功" */
          message?: string;
        },
        any
      >({
        path: `/app/mongo-users/login`,
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
     * @tags app端-用户相关(MongoDB版)
     * @name MongoUsersControllerFindOne
     * @summary 根据ID获取用户
     * @request GET:/app/mongo-users/{id}
     * @secure
     */
    mongoUsersControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          data?: User;
          /** @example 0 */
          code?: number;
          /** @example "请求成功" */
          message?: string;
        },
        any
      >({
        path: `/app/mongo-users/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags app端-用户相关(MongoDB版)
     * @name MongoUsersControllerUpdate
     * @summary 根据ID更新用户
     * @request PATCH:/app/mongo-users/{id}
     * @secure
     */
    mongoUsersControllerUpdate: (id: string, data: UpdateUserDto, params: RequestParams = {}) =>
      this.request<
        {
          data?: User;
          /** @example 0 */
          code?: number;
          /** @example "请求成功" */
          message?: string;
        },
        any
      >({
        path: `/app/mongo-users/${id}`,
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
     * @tags app端-用户相关(MongoDB版)
     * @name MongoUsersControllerRemove
     * @summary 根据ID删除用户
     * @request DELETE:/app/mongo-users/{id}
     * @secure
     */
    mongoUsersControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          data?: User;
          /** @example 0 */
          code?: number;
          /** @example "请求成功" */
          message?: string;
        },
        any
      >({
        path: `/app/mongo-users/${id}`,
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
}
