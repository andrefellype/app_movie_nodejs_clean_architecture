import MyTvShowEpisode from "../../entity/myTvShowEpisode/MyTvShowEpisode"

export default interface MyTvShowEpisodeRepository {
    countByTvShowIdAndUserId(tvShowId: string, userId: string): Promise<number>
    deleteAll(where: object): Promise<boolean>
    deleteByTvShowIdAndUserId(tvShowId: string, userId: string): Promise<boolean>
    countByTvShowSeasonIdAndUserId(tvShowSeasonId: string, userId: string): Promise<number>
    openByTvShowEpisodeIdAndUserId(tvShowEpisodeId: string, userId: string): Promise<MyTvShowEpisode | null>
    getAllByUserId(userId: string): Promise<MyTvShowEpisode[]>
}