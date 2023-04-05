interface IRole {
    id: number
    name: string
    users: IUser[]
    createdAt: Date
    updatedAt: Date
}