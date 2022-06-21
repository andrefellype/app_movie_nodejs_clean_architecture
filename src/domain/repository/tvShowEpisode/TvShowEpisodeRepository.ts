import TvShowEpisode from "../../entity/tvShowEpisode/TvShowEpisode"

export default interface TvShowEpisodeRepository {
    countByTvShowSeasonIdsAndStatus(tvShowSeasonIds: string[], statusValue: boolean): Promise<number>
    getAllByTvShowSeasonIds(seasonIds: string[]): Promise<TvShowEpisode[]>
    deleteAllByIds(ids: string[]): Promise<boolean>
    getAllByIds(ids: string[]): Promise<TvShowEpisode[]>
    countByTvShowSeasonIdAndStatus(tvShowSeasonId: string, statusValue: boolean): Promise<number>
    deleteByTvShowSeasonId(tvShowSeasonId: string): Promise<boolean>
    openByNameAndTvShowSeasonId(nameValue: string, tvShowSeasonId: string): Promise<TvShowEpisode | null>
    getAllByTvShowSeasonIdAndStatus(tvShowSeasonId: string, statusValue: boolean): Promise<TvShowEpisode[]>
}