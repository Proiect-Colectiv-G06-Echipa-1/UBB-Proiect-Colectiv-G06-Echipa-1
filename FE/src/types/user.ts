export interface IUser{
    id: number,
    username?: string,
    password: string,
    email: string,
    isAdmin: boolean,
}

export type TUserRole = "admin" | "user";