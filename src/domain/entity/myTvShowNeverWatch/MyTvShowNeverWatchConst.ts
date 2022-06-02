export const MY_TV_SHOW_NEVER_WATCHS_NAME_OBJECT = "my_tv_show_never_watchs"

export function MyTvShowNeverWatchSetObjectDB(userId: object, tvShowIdValue: object, createdAtValue: string, updatedAtValue: string | null = null) {
    return {
        user_id: userId,
        tv_show_id: tvShowIdValue,
        created_at: createdAtValue,
        updated_at: updatedAtValue
    }
}