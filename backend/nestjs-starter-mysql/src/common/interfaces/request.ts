export interface JWTUser {
    userId: string,
    roles: number[],
    customData: Record<string, any>
}

export interface IRequest extends Request {
    user: JWTUser,
    [x:string]:any
}
