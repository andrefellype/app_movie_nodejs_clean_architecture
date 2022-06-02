export default class Movie {
    public readonly _id: string
    public readonly title: string
    public readonly release: string
    public readonly duration: string
    public readonly movie_theater: boolean
    public readonly resume?: string
    public readonly categories_id: string[]
    public readonly directors_id: string[]
    public readonly casts_id: string[]
    public readonly countries_id: string[]
    public readonly streams_id: string[]
    public readonly user_register?: string
    public readonly reviewed: boolean
    public readonly status: boolean
    public readonly created_at: string
    public readonly updated_at?: string
}