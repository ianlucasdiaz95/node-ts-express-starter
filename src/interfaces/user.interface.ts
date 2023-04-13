import { Roles } from "./role.interface"

export interface IUser {
    id: number
    email: string
    name: string
    password: string
    role: Roles
    createdAt: Date
    updatedAt: Date
}