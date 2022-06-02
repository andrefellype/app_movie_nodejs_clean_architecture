import Database from "../../app/config/Database"
import { ObjectId } from "mongodb"
import CrudRepository from "../../domain/repository/CrudRepository"
import MyTvShowNeverWatch from "../../domain/entity/myTvShowNeverWatch/MyTvShowNeverWatch"
import { MY_TV_SHOW_NEVER_WATCHS_NAME_OBJECT, MyTvShowNeverWatchSetObjectDB } from "../../domain/entity/myTvShowNeverWatch/MyTvShowNeverWatchConst"
import MyTvShowNeverWatchRepository from "../../domain/repository/myTvShowNeverWatch/MyTvShowNeverWatchRepository"

export default class MyTvShowNeverWatchDAO implements MyTvShowNeverWatchRepository, CrudRepository<MyTvShowNeverWatch> {
    deleteAll(where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(MY_TV_SHOW_NEVER_WATCHS_NAME_OBJECT, where).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    openByTvShowIdAndUserId(tvShowId: string, userId: string): Promise<MyTvShowNeverWatch> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(MY_TV_SHOW_NEVER_WATCHS_NAME_OBJECT, { tv_show_id: new ObjectId(tvShowId), user_id: new ObjectId(userId) }).then(valueJson => {
                resolve(valueJson != null ? Object.assign(new MyTvShowNeverWatch(), valueJson) : null)
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
    open(idOpen: string): Promise<MyTvShowNeverWatch> {
        throw new Error("Method not implemented.")
    }

    create(userId: string, tvShowId: string, createdAtValue: string, updatedAtValue?: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = MyTvShowNeverWatchSetObjectDB(new ObjectId(userId), new ObjectId(tvShowId), createdAtValue, updatedAtValue)
            await Database.insert(MY_TV_SHOW_NEVER_WATCHS_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    getAll(): Promise<MyTvShowNeverWatch[]> {
        throw new Error("Method not implemented.")
    }

}