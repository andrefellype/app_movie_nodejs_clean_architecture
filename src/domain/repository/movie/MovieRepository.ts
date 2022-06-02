import Movie from "../../entity/movie/Movie"

export default interface MovieRepository {
    deleteAll(where: object): Promise<boolean>
    getAllByIds(ids: string[]): Promise<Movie[]>
    getAllByStreamsId(streamsIdValue: string[]): Promise<Movie[]>
    getAllByCountriesId(countriesIdValue: string[]): Promise<Movie[]>
    getAllByCastsId(castsIdValue: string[]): Promise<Movie[]>
    getAllByDirectorsId(directorsIdValue: string[]): Promise<Movie[]>
    openByTitle(titleValue: string): Promise<Movie>
    getAllByStatus(statusValue: boolean): Promise<Movie[]>
}