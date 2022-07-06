import MyMovieNeverWatch from "../../entity/myMovieNeverWatch/MyMovieNeverWatch"

export default interface MyMovieNeverWatchRepository {
    deleteAllByMovieIds(idMovies: string[]): Promise<boolean>
    
    findByMovieIdAndUserId(movieId: string, userId: string): Promise<MyMovieNeverWatch | null>
}