import MyMovie from "../../entity/myMovie/MyMovie"

export default interface MyMovieRepository {
    deleteAll(where: object): Promise<boolean>
    deleteByMovieIdAndUserId(movieId: string, userId: string): Promise<boolean>
    openByMovieIdAndUserId(movieId: string, userId: string): Promise<MyMovie | null>
    getAllByUserId(userId: string): Promise<MyMovie[]>
}