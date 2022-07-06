import MyTvShowEpisode from "../../entity/myTvShowEpisode/MyTvShowEpisode"

export default interface MyTvShowEpisodeRepository {
    countAllByTvShowIdAndUserId(tvShowId: string, userId: string): Promise<number>

    deleteAllByTvShowIds(tvShowIds: string[]): Promise<boolean>

    deleteAllByTvShowSeasonsIds(idSeasons: string[]): Promise<boolean>

    deleteAllByTvShowEpisodeIds(idEpisodes: string[]): Promise<boolean>

    deleteAllByTvShowIdAndUserIds(tvShowId: string, userId: string): Promise<boolean>

    countAllByTvShowSeasonIdAndUserId(tvShowSeasonId: string, userId: string): Promise<number>

    findByTvShowEpisodeIdAndUserId(tvShowEpisodeId: string, userId: string): Promise<MyTvShowEpisode | null>
    
    findAllByUserId(userId: string): Promise<MyTvShowEpisode[]>
}