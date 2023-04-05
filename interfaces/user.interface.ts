interface IUser {
    id: number
    email: string
    name: string
    password: string
    role: IRole
    roleId: string
    createdAt: Date
    updatedAt: Date
}