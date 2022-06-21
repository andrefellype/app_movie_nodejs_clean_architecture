import Movie from "./Movie"

export const MOVIE_NAME_OBJECT = "movies"

export function MovieSetObjectDB(
    titleValue: string, releaseValue: string, durationValue: string, movie_theaterValue: boolean, resume: string, categoriesIdValue: object[],
    directorsIdValue: object[], castsIdValue: object[], countriesIdValue: object[], streamsIdValue: object[], userRegister: object | null,
    reviewedValue: boolean, statusValue: boolean, createdAtValue: string
) {
    return {
        title: titleValue,
        release: releaseValue,
        duration: durationValue,
        movie_theater: movie_theaterValue,
        resume: resume,
        categories_id: categoriesIdValue,
        directors_id: directorsIdValue,
        casts_id: castsIdValue,
        countries_id: countriesIdValue,
        streams_id: streamsIdValue,
        user_register: userRegister,
        reviewed: reviewedValue,
        status: statusValue,
        created_at: createdAtValue,
        updated_at: null
    }
}

export function MovieGetObjectForJson(movie: Movie, user?: any) {
    return {
        _id: movie._id,
        title: movie.title,
        release: movie.release,
        duration: movie.duration,
        movie_theater: movie.movie_theater,
        resume: movie.resume,
        categories_id: movie.categories_id,
        directors_id: movie.directors_id,
        casts_id: movie.casts_id,
        countries_id: movie.countries_id,
        streams_id: movie.streams_id,
        user_register: movie.user_register,
        reviewed: movie.reviewed,
        status: movie.status,
        created_at: movie.created_at,
        updated_at: movie.updated_at,
        enabledEdit: (user.level == "ADMIN" || (!movie.reviewed && user._id == movie.user_register)),
        enabledApproved: (user.level == "ADMIN" && !movie.reviewed),
        categories: [],
        directors: [],
        casts: [],
        countries: [],
        streams: [],
        mymovie: false,
        neverwatch: false
    }
}