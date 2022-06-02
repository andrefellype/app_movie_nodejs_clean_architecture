export const MY_TV_SHOW_SEASON_NEVER_WATCHS_NAME_OBJECT = "my_tv_show_season_never_watchs"

export function MyTvShowSeasonNeverWatchSetObjectDB(userId: object, seasonIdValue: object, tvShowId: object, createdAtValue: string, updatedAtValue: string | null = null) {
    return {
        user_id: userId,
        tv_show_id: tvShowId,
        tv_show_season_id: seasonIdValue,
        created_at: createdAtValue,
        updated_at: updatedAtValue
    }
}