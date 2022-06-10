import MyTvShowEpisodeNeverWatch from "../../entity/myTvShowEpisodeNeverWatch/MyTvShowEpisodeNeverWatch"

export default interface MyTvShowEpisodeNeverWatchRepository {
    countByTvShowIdAndUserId(tvShowId: string, userId: string): Promise<number>
    deleteAll(where: object): Promise<boolean>
    countByTvShowSeasonIdAndUserId(seasonId: string, userId: string): Promise<number>
    openByTvShowEpisodeIdAndUserId(episodeId: string, userId: string): Promise<MyTvShowEpisodeNeverWatch | null>
}