export const MY_TV_SHOW_NEVER_WATCHS_NAME_OBJECT = "my_tv_show_never_watchs"

export function SetMyTvShowNeverWatchDB(userId: object, tvShowIdValue: object, createdAtValue: string) {
    return {
        user_id: userId,
        tv_show_id: tvShowIdValue,
        created_at: createdAtValue,
        updated_at: null
    }
}