export const MY_MOVIE_NEVER_WATCHS_NAME_OBJECT = "my_movie_never_watchs"

export function SetMyMovieNeverWatchDB(userId: object, movieIdValue: object, createdAtValue: string) {
    return {
        user_id: userId,
        movie_id: movieIdValue,
        created_at: createdAtValue,
        updated_at: null
    }
}