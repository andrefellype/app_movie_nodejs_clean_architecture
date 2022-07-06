import Database from "../../app/config/Database"
import { ObjectId } from "mongodb"
import CrudRepository from "../../domain/repository/CrudRepository"
import MyTvShowNeverWatch from "../../domain/entity/myTvShowNeverWatch/MyTvShowNeverWatch"
import { MY_TV_SHOW_NEVER_WATCHS_NAME_OBJECT, SetMyTvShowNeverWatchDB } from "../../domain/entity/myTvShowNeverWatch/MyTvShowNeverWatchConst"
import MyTvShowNeverWatchRepository from "../../domain/repository/myTvShowNeverWatch/MyTvShowNeverWatchRepository"

export default class MyTvShowNeverWatchDAO implements MyTvShowNeverWatchRepository, CrudRepository<MyTvShowNeverWatch> {
    deleteAllByTvShowIds(tvShowIds: string[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const _ids = tvShowIds.map(i => new ObjectId(i))
            await Database.deleteByWhere(MY_TV_SHOW_NEVER_WATCHS_NAME_OBJECT, { tv_show_id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    findByTvShowIdAndUserId(tvShowId: string, userId: string): Promise<MyTvShowNeverWatch | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(MY_TV_SHOW_NEVER_WATCHS_NAME_OBJECT, { tv_show_id: new ObjectId(tvShowId), user_id: new ObjectId(userId) }).then(valueJson => {
                resolve(valueJson != null ? Object.assign(new MyTvShowNeverWatch(), valueJson) : null)
            })
            reject([])
        })
    }

    deleteById(idDelete: string): Promise<boolean> {
        throw new Error("Method not implemented.")
    }

    updateByWhere(data: object, where: object): Promise<boolean> {
        throw new Error("Method not implemented.")
    }

    updateByIds(data: object, ids: string[]): Promise<boolean> {
        throw new Error("Method not implemented.")
    }
    
    updateById(data: object, id: string): Promise<boolean> {
        throw new Error("Method not implemented.")
    }

    find(idOpen: string): Promise<MyTvShowNeverWatch> {
        throw new Error("Method not implemented.")
    }

    create(userId: string, tvShowId: string, createdAtValue: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = SetMyTvShowNeverWatchDB(new ObjectId(userId), new ObjectId(tvShowId), createdAtValue)
            await Database.insert(MY_TV_SHOW_NEVER_WATCHS_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    findAll(): Promise<MyTvShowNeverWatch[]> {
        throw new Error("Method not implemented.")
    }
}