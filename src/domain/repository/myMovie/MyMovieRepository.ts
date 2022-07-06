import MyMovie from "../../entity/myMovie/MyMovie"

export default interface MyMovieRepository {
    deleteAllByMovieIds(idMovies: string[]): Promise<boolean>

    deleteAllByMovieIdAndUserId(movieId: string, userId: string): Promise<boolean>

    findByMovieIdAndUserId(movieId: string, userId: string): Promise<MyMovie | null>
    
    findAllByUserId(userId: string): Promise<MyMovie[]>
}