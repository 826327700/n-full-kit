export interface JWTUser {
    userId: string,
    roles: string[],
    customData: Record<string, any>
}

export interface IRequest extends Request {
    user: JWTUser,
    [x:string]:any
}
  