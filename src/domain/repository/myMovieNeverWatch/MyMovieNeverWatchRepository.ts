import MyMovieNeverWatch from "../../entity/myMovieNeverWatch/MyMovieNeverWatch"

export default interface MyMovieNeverWatchRepository {
    deleteAll(where: object): Promise<boolean>
    openByMovieIdAndUserId(movieId: string, userId: string): Promise<MyMovieNeverWatch>
}