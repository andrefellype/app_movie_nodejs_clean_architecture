export const MY_TV_SHOW_EPISODE_NEVER_WATCHS_NAME_OBJECT = "my_tv_show_episode_never_watchs"

export function MyTvShowEpisodeNeverWatchSetObjectDB(userId: object, episodeIdValue: object, seasonIdValue: object, tvShowIdValue: object, createdAtValue: string) {
    return {
        user_id: userId,
        tv_show_id: tvShowIdValue,
        tv_show_season_id: seasonIdValue,
        tv_show_episode_id: episodeIdValue,
        created_at: createdAtValue,
        updated_at: null
    }
}