import Database from "../../app/config/Database"
import { ObjectId } from "mongodb"
import CrudRepository from "../../domain/repository/CrudRepository"
import MyTvShowSeasonNeverWatch from "../../domain/entity/myTvShowSeasonNeverWatch/MyTvShowSeasonNeverWatch"
import { MY_TV_SHOW_SEASON_NEVER_WATCHS_NAME_OBJECT, SetMyTvShowSeasonNeverWatchDB } from "../../domain/entity/myTvShowSeasonNeverWatch/MyTvShowSeasonNeverWatchConst"
import MyTvShowSeasonNeverWatchRepository from "../../domain/repository/myTvShowSeasonNeverWatch/MyTvShowSeasonNeverWatchRepository"

export default class MyTvShowSeasonNeverWatchDAO implements MyTvShowSeasonNeverWatchRepository, CrudRepository<MyTvShowSeasonNeverWatch> {
    deleteAllByTvShowIds(tvShowIds: string[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const _ids = tvShowIds.map(i => new ObjectId(i))
            await Database.deleteByWhere(MY_TV_SHOW_SEASON_NEVER_WATCHS_NAME_OBJECT, { tv_show_id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    deleteAllByTvShowSeasonIds(idSeasons: string[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const _ids = idSeasons.map(i => new ObjectId(i))
            await Database.deleteByWhere(MY_TV_SHOW_SEASON_NEVER_WATCHS_NAME_OBJECT, { tv_show_season_id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    findByTvShowSeasonIdAndUserId(seasonId: string, userId: string): Promise<MyTvShowSeasonNeverWatch | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(MY_TV_SHOW_SEASON_NEVER_WATCHS_NAME_OBJECT, { tv_show_season_id: (new ObjectId(seasonId)), user_id: new ObjectId(userId) }).then(valueJson => {
                resolve(valueJson != null ? Object.assign(new MyTvShowSeasonNeverWatch(), valueJson) : null)
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

    find(idOpen: string): Promise<MyTvShowSeasonNeverWatch> {
        throw new Error("Method not implemented.")
    }

    create(userId: string, seasonId: string, tvShowId: string, createdAtValue: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = SetMyTvShowSeasonNeverWatchDB(new ObjectId(userId), (new ObjectId(seasonId)), new ObjectId(tvShowId), createdAtValue)
            await Database.insert(MY_TV_SHOW_SEASON_NEVER_WATCHS_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    findAll(): Promise<MyTvShowSeasonNeverWatch[]> {
        throw new Error("Method not implemented.")
    }
}