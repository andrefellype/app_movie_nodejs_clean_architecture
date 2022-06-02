import TvShowSeason from "./TvShowSeason"

export const TV_SHOW_SEASON_NAME_OBJECT = "tv_show_seasons"

export function TvShowSeasonSetObjectDB(nameValue: string, tvShowId: object, userRegister: object, reviewedValue: boolean, statusValue: boolean, createdAtValue: string, updatedAtValue: string | null = null) {
    return {
        name: nameValue,
        tv_show_id: tvShowId,
        user_register: userRegister,
        reviewed: reviewedValue,
        status: statusValue,
        created_at: createdAtValue,
        updated_at: updatedAtValue
    }
}

export function TvShowSeasonGetObjectForJson(season: TvShowSeason, user?: any) {
    return {
        _id: season._id,
        name: season.name,
        tv_show_id: season.tv_show_id,
        user_register: season.user_register,
        reviewed: season.reviewed,
        status: season.status,
        created_at: season.created_at,
        updated_at: season.updated_at,
        enabledEdit: (user.level == "ADMIN" || (!season.reviewed && user._id == season.user_register)),
        enabledApproved: (user.level == "ADMIN" && !season.reviewed)
    }
}