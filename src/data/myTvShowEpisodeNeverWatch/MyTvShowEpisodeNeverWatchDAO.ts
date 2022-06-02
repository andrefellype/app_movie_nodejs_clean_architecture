import Database from "../../app/config/Database"
import { ObjectId } from "mongodb"
import CrudRepository from "../../domain/repository/CrudRepository"
import MyTvShowEpisodeNeverWatch from "../../domain/entity/myTvShowEpisodeNeverWatch/MyTvShowEpisodeNeverWatch"
import { MY_TV_SHOW_EPISODE_NEVER_WATCHS_NAME_OBJECT, MyTvShowEpisodeNeverWatchSetObjectDB } from "../../domain/entity/myTvShowEpisodeNeverWatch/MyTvShowEpisodeNeverWatchConst"
import MyTvShowEpisodeNeverWatchRepository from "../../domain/repository/myTvShowEpisodeNeverWatch/MyTvShowEpisodeNeverWatchRepository"

export default class MyTvShowEpisodeNeverWatchDAO implements MyTvShowEpisodeNeverWatchRepository, CrudRepository<MyTvShowEpisodeNeverWatch> {
    countByTvShowIdAndUserId(tvShowId: string, userId: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            await Database.countByWhere(MY_TV_SHOW_EPISODE_NEVER_WATCHS_NAME_OBJECT, { tv_show_id: (new ObjectId(tvShowId)), user_id: new ObjectId(userId) }).then(valueJson => {
                resolve(valueJson as number)
            })
            reject([])
        })
    }

    deleteAll(where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(MY_TV_SHOW_EPISODE_NEVER_WATCHS_NAME_OBJECT, where).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    countByTvShowSeasonIdAndUserId(seasonId: string, userId: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            await Database.countByWhere(MY_TV_SHOW_EPISODE_NEVER_WATCHS_NAME_OBJECT, { tv_show_season_id: (new ObjectId(seasonId)), user_id: new ObjectId(userId) }).then(valueJson => {
                resolve(valueJson as number)
            })
            reject([])
        })
    }

    openByTvShowEpisodeIdAndUserId(episodeId: string, userId: string): Promise<MyTvShowEpisodeNeverWatch> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(MY_TV_SHOW_EPISODE_NEVER_WATCHS_NAME_OBJECT, { tv_show_episode_id: (new ObjectId(episodeId)), user_id: new ObjectId(userId) }).then(valueJson => {
                resolve(valueJson != null ? Object.assign(new MyTvShowEpisodeNeverWatch(), valueJson) : null)
            })
            reject([])
        })
    }

    delete(idDelete: string): Promise<boolean> {
        throw new Error("Method not implemented.")
    }
    updateByWhere(data: object, where: object): Promise<boolean> {
        throw new Error("Method not implemented.")
    }
    open(idOpen: string): Promise<MyTvShowEpisodeNeverWatch> {
        throw new Error("Method not implemented.")
    }

    create(userId: string, episodeId: string, seasonId: string, tvShowId: string, createdAtValue: string, updatedAtValue?: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = MyTvShowEpisodeNeverWatchSetObjectDB(new ObjectId(userId), (new ObjectId(episodeId)), (new ObjectId(seasonId)), (new ObjectId(tvShowId)), createdAtValue, updatedAtValue)
            await Database.insert(MY_TV_SHOW_EPISODE_NEVER_WATCHS_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    getAll(): Promise<MyTvShowEpisodeNeverWatch[]> {
        throw new Error("Method not implemented.")
    }
}