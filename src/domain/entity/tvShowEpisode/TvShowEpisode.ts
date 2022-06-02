import ConvertData from "../../../app/core/ConvertData"

export default class TvShowEpisode {
    public readonly _id: string
    public readonly name: string
    public readonly tv_show_season_id: string
    public readonly user_register: string
    public readonly reviewed: boolean
    public readonly status: boolean
    public readonly created_at: string
    public readonly updated_at?: string
}