import TvShowSeason from "../../entity/tvShowSeason/TvShowSeason"

export default interface TvShowSeasonRepository {
    getAllIdsByTvShowIdAndStatus(tvShowId: string, statusValue: boolean): Promise<TvShowSeason[]>
    getAllByTvShowId(tvShowIds: object[]): Promise<TvShowSeason[]>
    deleteAll(where: object): Promise<boolean>
    getAllByIds(ids: string[]): Promise<TvShowSeason[]>
    openByNameAndTvShowId(nameValue: string, tvShowId: string): Promise<TvShowSeason | null>
    getAllByTvShowIdAndStatus(tvShowId: string, statusValue: boolean): Promise<TvShowSeason[]>
}