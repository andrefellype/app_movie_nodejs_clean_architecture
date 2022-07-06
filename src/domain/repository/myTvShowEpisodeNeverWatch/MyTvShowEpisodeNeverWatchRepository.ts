import MyTvShowEpisodeNeverWatch from "../../entity/myTvShowEpisodeNeverWatch/MyTvShowEpisodeNeverWatch"

export default interface MyTvShowEpisodeNeverWatchRepository {
    countAllByTvShowIdAndUserId(tvShowId: string, userId: string): Promise<number>

    deleteAllByTvShowIds(tvShowIds: string[]): Promise<boolean>

    deleteAllByTvShowSeasonsIds(idSeasons: string[]): Promise<boolean>

    deleteAllByTvShowEpisodeIds(idEpisodes: string[]): Promise<boolean>

    countAllByTvShowSeasonIdAndUserId(seasonId: string, userId: string): Promise<number>
    
    findByTvShowEpisodeIdAndUserId(episodeId: string, userId: string): Promise<MyTvShowEpisodeNeverWatch | null>
}