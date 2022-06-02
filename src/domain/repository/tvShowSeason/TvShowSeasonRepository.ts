import TvShowSeason from "../../entity/tvShowSeason/TvShowSeason"

export default interface TvShowSeasonRepository {
    getAllByTvShowId(tvShowIds: string[]): Promise<TvShowSeason[]>
    deleteAll(where: object): Promise<boolean>
    getAllByIds(ids: string[]): Promise<TvShowSeason[]>
    openByNameAndTvShowId(nameValue: string, tvShowId: string): Promise<TvShowSeason>
    getAllByTvShowIdAndStatus(tvShowId: string, statusValue: boolean): Promise<TvShowSeason[]>
}