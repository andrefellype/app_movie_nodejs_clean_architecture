import MyMovie from "./MyMovie"

export const MY_MOVIES_NAME_OBJECT = "my_movies"

export function MyMovieSetObjectDB(userId: object, movieIdValue: object, createdAtValue: string) {
    return {
        user_id: userId,
        movie_id: movieIdValue,
        created_at: createdAtValue,
        updated_at: null
    }
}

export function MyMovieGetObjectForJson(myMovie: MyMovie) {
    return {
        _id: myMovie._id,
        user_id: myMovie.user_id,
        movie_id: myMovie.movie_id,
        created_at: myMovie.created_at,
        updated_at: myMovie.updated_at,
        movie: null
    }
}