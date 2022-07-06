import TvShowSeason from "../../entity/tvShowSeason/TvShowSeason"

export default interface TvShowSeasonRepository {
    findAllIdsByTvShowIdAndStatus(tvShowId: string, statusValue: boolean): Promise<TvShowSeason[]>

    findAllByTvShowIds(tvShowIds: string[]): Promise<TvShowSeason[]>

    deleteAllByIds(ids: string[]): Promise<boolean>

    findAllByIds(ids: string[]): Promise<TvShowSeason[]>

    findByNameAndTvShowId(nameValue: string, tvShowId: string): Promise<TvShowSeason | null>
    
    findAllByTvShowIdAndStatus(tvShowId: string, statusValue: boolean): Promise<TvShowSeason[]>
}