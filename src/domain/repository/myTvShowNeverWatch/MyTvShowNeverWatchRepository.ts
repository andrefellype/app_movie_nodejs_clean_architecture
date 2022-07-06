import MyTvShowNeverWatch from "../../entity/myTvShowNeverWatch/MyTvShowNeverWatch"

export default interface MyTvShowNeverWatchRepository {
    deleteAllByTvShowIds(tvShowIds: string[]): Promise<boolean>
    
    findByTvShowIdAndUserId(tvShowId: string, userId: string): Promise<MyTvShowNeverWatch | null>
}