import MyTvShowEpisodeNeverWatch from "../../entity/myTvShowEpisodeNeverWatch/MyTvShowEpisodeNeverWatch"

export default interface MyTvShowEpisodeNeverWatchRepository {
    countByTvShowIdAndUserId(tvShowId: string, userId: string): Promise<number>
    deleteAllByTvShowIds(tvShowIds: string[]): Promise<boolean>
    deleteAllByTvShowSeasonsIds(idSeasons: string[]): Promise<boolean>
    deleteAllByTvShowEpisodeIds(idEpisodes: string[]): Promise<boolean>
    countByTvShowSeasonIdAndUserId(seasonId: string, userId: string): Promise<number>
    openByTvShowEpisodeIdAndUserId(episodeId: string, userId: string): Promise<MyTvShowEpisodeNeverWatch | null>
}