import Database from "../../app/config/Database"
import { ObjectId } from "mongodb"
import CrudRepository from "../../domain/repository/CrudRepository"
import MyTvShowSeasonNeverWatch from "../../domain/entity/myTvShowSeasonNeverWatch/MyTvShowSeasonNeverWatch"
import { MY_TV_SHOW_SEASON_NEVER_WATCHS_NAME_OBJECT, MyTvShowSeasonNeverWatchSetObjectDB } from "../../domain/entity/myTvShowSeasonNeverWatch/MyTvShowSeasonNeverWatchConst"
import MyTvShowSeasonNeverWatchRepository from "../../domain/repository/myTvShowSeasonNeverWatch/MyTvShowSeasonNeverWatchRepository"

export default class MyTvShowSeasonNeverWatchDAO implements MyTvShowSeasonNeverWatchRepository, CrudRepository<MyTvShowSeasonNeverWatch> {
    deleteAll(where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(MY_TV_SHOW_SEASON_NEVER_WATCHS_NAME_OBJECT, where).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    openByTvShowSeasonIdAndUserId(seasonId: string, userId: string): Promise<MyTvShowSeasonNeverWatch> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(MY_TV_SHOW_SEASON_NEVER_WATCHS_NAME_OBJECT, { tv_show_season_id: (new ObjectId(seasonId)), user_id: new ObjectId(userId) }).then(valueJson => {
                resolve(valueJson != null ? Object.assign(new MyTvShowSeasonNeverWatch(), valueJson) : null)
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
    open(idOpen: string): Promise<MyTvShowSeasonNeverWatch> {
        throw new Error("Method not implemented.")
    }

    create(userId: string, seasonId: string, tvShowId: string, createdAtValue: string, updatedAtValue?: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = MyTvShowSeasonNeverWatchSetObjectDB(new ObjectId(userId), (new ObjectId(seasonId)), new ObjectId(tvShowId), createdAtValue, updatedAtValue)
            await Database.insert(MY_TV_SHOW_SEASON_NEVER_WATCHS_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    getAll(): Promise<MyTvShowSeasonNeverWatch[]> {
        throw new Error("Method not implemented.")
    }
}