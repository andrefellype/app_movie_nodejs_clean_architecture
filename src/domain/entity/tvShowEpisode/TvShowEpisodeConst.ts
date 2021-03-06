import TvShowEpisode from "./TvShowEpisode"

export const TV_SHOW_EPISODES_NAME_OBJECT = "tv_show_episodes"

export function SetTvShowEpisodeDB(nameValue: string, tvShowSeasonId: object, userRegister: object | null, reviewedValue: boolean, statusValue: boolean, createdAtValue: string) {
    return {
        name: nameValue,
        tv_show_season_id: tvShowSeasonId,
        user_register: userRegister,
        reviewed: reviewedValue,
        status: statusValue,
        created_at: createdAtValue,
        updated_at: null
    }
}

export function GetTvShowEpisodeByJson(episode: TvShowEpisode, user?: any) {
    return {
        _id: episode._id,
        name: episode.name,
        tv_show_season_id: episode.tv_show_season_id,
        user_register: episode.user_register,
        reviewed: episode.reviewed,
        status: episode.status,
        created_at: episode.created_at,
        updated_at: episode.updated_at,
        enabledEdit: (user.level == "ADMIN" || (!episode.reviewed && user._id == episode.user_register)),
        enabledApproved: (user.level == "ADMIN" && !episode.reviewed)
    }
}