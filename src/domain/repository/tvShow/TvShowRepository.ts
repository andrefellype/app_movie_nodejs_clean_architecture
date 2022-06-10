import TvShow from "../../entity/tvShow/TvShow"

export default interface TvShowRepository {
    deleteAll(where: object): Promise<boolean>
    getAllByIds(ids: string[]): Promise<TvShow[]>
    getAllByStreamsId(streamsIdValue: object[]): Promise<TvShow[]>
    getAllByCountriesId(countriesIdValue: object[]): Promise<TvShow[]>
    openByTitle(titleValue: string): Promise<TvShow | null>
    getAllByStatus(statusValue: boolean): Promise<TvShow[]>
}