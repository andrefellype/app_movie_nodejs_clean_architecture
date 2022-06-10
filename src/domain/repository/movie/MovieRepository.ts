import Movie from "../../entity/movie/Movie"

export default interface MovieRepository {
    deleteAll(where: object): Promise<boolean>
    getAllByIds(ids: string[]): Promise<Movie[]>
    getAllByStreamsId(streamsIdValue: object[]): Promise<Movie[]>
    getAllByCountriesId(countriesIdValue: object[]): Promise<Movie[]>
    getAllByCastsId(castsIdValue: object[]): Promise<Movie[]>
    getAllByDirectorsId(directorsIdValue: object[]): Promise<Movie[]>
    openByTitle(titleValue: string): Promise<Movie | null>
    getAllByStatus(statusValue: boolean): Promise<Movie[]>
}