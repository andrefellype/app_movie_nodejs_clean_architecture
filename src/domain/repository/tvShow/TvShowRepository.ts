import TvShow from "../../entity/tvShow/TvShow"

export default interface TvShowRepository {
    deleteAllByIds(ids: string[]): Promise<boolean>
    getAllByIds(ids: string[]): Promise<TvShow[]>
    getAllByStreamsIds(streamsIdValue: string[]): Promise<TvShow[]>
    getAllByCountriesIds(countriesIdValue: string[]): Promise<TvShow[]>
    openByTitle(titleValue: string): Promise<TvShow | null>
    getAllByStatus(statusValue: boolean): Promise<TvShow[]>
}