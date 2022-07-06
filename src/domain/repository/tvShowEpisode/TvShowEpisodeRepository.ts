import TvShowEpisode from "../../entity/tvShowEpisode/TvShowEpisode"

export default interface TvShowEpisodeRepository {
    countAllByTvShowSeasonIdsAndStatus(tvShowSeasonIds: string[], statusValue: boolean): Promise<number>

    findAllByTvShowSeasonIds(seasonIds: string[]): Promise<TvShowEpisode[]>

    deleteAllByIds(ids: string[]): Promise<boolean>

    findAllByIds(ids: string[]): Promise<TvShowEpisode[]>

    countAllByTvShowSeasonIdAndStatus(tvShowSeasonId: string, statusValue: boolean): Promise<number>

    findByNameAndTvShowSeasonId(nameValue: string, tvShowSeasonId: string): Promise<TvShowEpisode | null>
    
    findAllByTvShowSeasonIdAndStatus(tvShowSeasonId: string, statusValue: boolean): Promise<TvShowEpisode[]>
}