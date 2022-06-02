import TvShow from "../../entity/tvShow/TvShow"

export default interface TvShowRepository {
    deleteAll(where: object): Promise<boolean>
    getAllByIds(ids: string[]): Promise<TvShow[]>
    getAllByStreamsId(streamsIdValue: string[]): Promise<TvShow[]>
    getAllByCountriesId(countriesIdValue: string[]): Promise<TvShow[]>
    openByTitle(titleValue: string): Promise<TvShow>
    getAllByStatus(statusValue: boolean): Promise<TvShow[]>
}