export interface IRole {
    id: number
    name: Roles
    isDefault: boolean
}

export enum Roles {
    ADMIN = "ADMIN",
    USER = "USER"
}
