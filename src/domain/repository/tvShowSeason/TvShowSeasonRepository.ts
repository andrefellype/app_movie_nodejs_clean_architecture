import TvShowSeason from "../../entity/tvShowSeason/TvShowSeason"

export default interface TvShowSeasonRepository {
    getAllIdsByTvShowIdAndStatus(tvShowId: string, statusValue: boolean): Promise<TvShowSeason[]>
    getAllByTvShowIds(tvShowIds: string[]): Promise<TvShowSeason[]>
    deleteAllByIds(ids: string[]): Promise<boolean>
    getAllByIds(ids: string[]): Promise<TvShowSeason[]>
    openByNameAndTvShowId(nameValue: string, tvShowId: string): Promise<TvShowSeason | null>
    getAllByTvShowIdAndStatus(tvShowId: string, statusValue: boolean): Promise<TvShowSeason[]>
}