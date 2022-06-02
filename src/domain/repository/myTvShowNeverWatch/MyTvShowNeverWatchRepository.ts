import MyTvShowNeverWatch from "../../entity/myTvShowNeverWatch/MyTvShowNeverWatch"

export default interface MyTvShowNeverWatchRepository {
    deleteAll(where: object): Promise<boolean>
    openByTvShowIdAndUserId(tvShowId: string, userId: string): Promise<MyTvShowNeverWatch>
}