import TvShow from "../../entity/tvShow/TvShow"

export default interface TvShowRepository {
    deleteAllByIds(ids: string[]): Promise<boolean>

    findAllByIds(ids: string[]): Promise<TvShow[]>

    findAllByStreamsIds(streamsIdValue: string[]): Promise<TvShow[]>

    findAllByCountriesIds(countriesIdValue: string[]): Promise<TvShow[]>

    findByTitle(titleValue: string): Promise<TvShow | null>
    
    findAllByStatus(statusValue: boolean): Promise<TvShow[]>
}