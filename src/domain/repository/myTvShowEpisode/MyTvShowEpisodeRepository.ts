import MyTvShowEpisode from "../../entity/myTvShowEpisode/MyTvShowEpisode"

export default interface MyTvShowEpisodeRepository {
    countByTvShowIdAndUserId(tvShowId: string, userId: string): Promise<number>
    deleteAllByTvShowIds(tvShowIds: string[]): Promise<boolean>
    deleteAllByTvShowSeasonsIds(idSeasons: string[]): Promise<boolean>
    deleteAllByTvShowEpisodeIds(idEpisodes: string[]): Promise<boolean>
    deleteByTvShowIdAndUserIds(tvShowId: string, userId: string): Promise<boolean>
    countByTvShowSeasonIdAndUserId(tvShowSeasonId: string, userId: string): Promise<number>
    openByTvShowEpisodeIdAndUserId(tvShowEpisodeId: string, userId: string): Promise<MyTvShowEpisode | null>
    getAllByUserId(userId: string): Promise<MyTvShowEpisode[]>
}