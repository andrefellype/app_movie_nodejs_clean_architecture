import Movie from "../../entity/movie/Movie"

export default interface MovieRepository {
    deleteAllByIds(ids: string[]): Promise<boolean>
    getAllByIds(ids: string[]): Promise<Movie[]>
    getAllByStreamsIds(streamsIdValue: string[]): Promise<Movie[]>
    getAllByCountriesIds(countriesIdValue: string[]): Promise<Movie[]>
    getAllByCastsIds(castsIdValue: string[]): Promise<Movie[]>
    getAllByDirectorsIds(directorsIdValue: string[]): Promise<Movie[]>
    openByTitle(titleValue: string): Promise<Movie | null>
    getAllByStatus(statusValue: boolean): Promise<Movie[]>
}