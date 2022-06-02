import MyTvShowSeasonNeverWatch from "../../entity/myTvShowSeasonNeverWatch/MyTvShowSeasonNeverWatch"

export default interface MyTvShowSeasonNeverWatchRepository {
    deleteAll(where: object): Promise<boolean>
    openByTvShowSeasonIdAndUserId(seasonId: string, userId: string): Promise<MyTvShowSeasonNeverWatch>
}