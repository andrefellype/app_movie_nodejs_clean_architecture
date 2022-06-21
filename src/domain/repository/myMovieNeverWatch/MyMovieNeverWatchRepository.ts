import MyMovieNeverWatch from "../../entity/myMovieNeverWatch/MyMovieNeverWatch"

export default interface MyMovieNeverWatchRepository {
    deleteAllByMovieIds(idMovies: string[]): Promise<boolean>
    openByMovieIdAndUserId(movieId: string, userId: string): Promise<MyMovieNeverWatch | null>
}