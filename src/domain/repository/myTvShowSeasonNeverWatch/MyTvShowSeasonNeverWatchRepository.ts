import MyTvShowSeasonNeverWatch from "../../entity/myTvShowSeasonNeverWatch/MyTvShowSeasonNeverWatch"

export default interface MyTvShowSeasonNeverWatchRepository {
    deleteAllByTvShowIds(tvShowIds: string[]): Promise<boolean>
    deleteAllByTvShowSeasonIds(idSeasons: string[]): Promise<boolean>
    openByTvShowSeasonIdAndUserId(seasonId: string, userId: string): Promise<MyTvShowSeasonNeverWatch | null>
}