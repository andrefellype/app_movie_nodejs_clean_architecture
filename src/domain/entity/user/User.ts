export default class User {
    public readonly _id: string
    public readonly name: string
    public readonly birth?: string
    public readonly email: string
    public readonly cellphone: string
    public readonly password: string
    public readonly level: string
    public readonly code_recovery?: string
    public readonly enabled: boolean
    public readonly status: boolean
    public readonly created_at: string
    public readonly updated_at?: string
    public readonly last_access_at?: string
}