import TvShow from "./TvShow"

export const TV_SHOW_NAME_OBJECT = "tv_shows"

export function TvShowSetObjectDB(
    titleValue: string, releaseValue: string, resume: string, categoriesIdValue: string[], countriesIdValue: string[], streamsIdValue: string[],
    userRegister: object | null, reviewedValue: boolean, statusValue: boolean, createdAtValue: string) {
    return {
        title: titleValue,
        release: releaseValue,
        resume: resume,
        categories_id: categoriesIdValue,
        countries_id: countriesIdValue,
        streams_id: streamsIdValue,
        user_register: userRegister,
        reviewed: reviewedValue,
        status: statusValue,
        created_at: createdAtValue,
        updated_at: null
    }
}

export function TvShowGetObjectForJson(tvShow: TvShow, user?: any) {
    return {
        _id: tvShow._id,
        title: tvShow.title,
        release: tvShow.release,
        resume: tvShow.resume,
        categories_id: tvShow.categories_id,
        countries_id: tvShow.countries_id,
        streams_id: tvShow.streams_id,
        user_register: tvShow.user_register,
        reviewed: tvShow.reviewed,
        status: tvShow.status,
        created_at: tvShow.created_at,
        updated_at: tvShow.updated_at,
        enabledEdit: (user.level == "ADMIN" || (!tvShow.reviewed && user._id == tvShow.user_register)),
        enabledApproved: (user.level == "ADMIN" && !tvShow.reviewed),
        categories: [],
        countries: [],
        streams: [],
        statusMyTvShow: false
    }
}