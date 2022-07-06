import Movie from "../../entity/movie/Movie"

export default interface MovieRepository {
    deleteAllByIds(ids: string[]): Promise<boolean>

    findAllByIds(ids: string[]): Promise<Movie[]>

    findAllByStreamsIds(streamsIdValue: string[]): Promise<Movie[]>

    findAllByCountriesIds(countriesIdValue: string[]): Promise<Movie[]>

    findAllByCastsIds(castsIdValue: string[]): Promise<Movie[]>

    findAllByDirectorsIds(directorsIdValue: string[]): Promise<Movie[]>

    findByTitle(titleValue: string): Promise<Movie | null>
    
    findAllByStatus(statusValue: boolean): Promise<Movie[]>
}