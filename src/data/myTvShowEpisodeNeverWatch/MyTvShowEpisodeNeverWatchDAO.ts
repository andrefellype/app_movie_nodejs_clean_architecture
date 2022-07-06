import Database from "../../app/config/Database"
import { ObjectId } from "mongodb"
import CrudRepository from "../../domain/repository/CrudRepository"
import MyTvShowEpisodeNeverWatch from "../../domain/entity/myTvShowEpisodeNeverWatch/MyTvShowEpisodeNeverWatch"
import { MY_TV_SHOW_EPISODE_NEVER_WATCHS_NAME_OBJECT, SetMyTvShowEpisodeNeverWatchDB } from "../../domain/entity/myTvShowEpisodeNeverWatch/MyTvShowEpisodeNeverWatchConst"
import MyTvShowEpisodeNeverWatchRepository from "../../domain/repository/myTvShowEpisodeNeverWatch/MyTvShowEpisodeNeverWatchRepository"

export default class MyTvShowEpisodeNeverWatchDAO implements MyTvShowEpisodeNeverWatchRepository, CrudRepository<MyTvShowEpisodeNeverWatch> {
    countAllByTvShowIdAndUserId(tvShowId: string, userId: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            await Database.countByWhere(MY_TV_SHOW_EPISODE_NEVER_WATCHS_NAME_OBJECT, { tv_show_id: (new ObjectId(tvShowId)), user_id: new ObjectId(userId) }).then(valueJson => {
                resolve(valueJson as number)
            })
            reject([])
        })
    }

    deleteAllByTvShowIds(tvShowIds: string[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const _ids = tvShowIds.map(i => new ObjectId(i))
            await Database.deleteByWhere(MY_TV_SHOW_EPISODE_NEVER_WATCHS_NAME_OBJECT, { tv_show_id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    deleteAllByTvShowSeasonsIds(idSeasons: string[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const _ids = idSeasons.map(i => new ObjectId(i))
            await Database.deleteByWhere(MY_TV_SHOW_EPISODE_NEVER_WATCHS_NAME_OBJECT, { tv_show_season_id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    deleteAllByTvShowEpisodeIds(idEpisodes: string[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const _ids = idEpisodes.map(i => new ObjectId(i))
            await Database.deleteByWhere(MY_TV_SHOW_EPISODE_NEVER_WATCHS_NAME_OBJECT, { tv_show_episode_id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    countAllByTvShowSeasonIdAndUserId(seasonId: string, userId: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            await Database.countByWhere(MY_TV_SHOW_EPISODE_NEVER_WATCHS_NAME_OBJECT, { tv_show_season_id: (new ObjectId(seasonId)), user_id: new ObjectId(userId) }).then(valueJson => {
                resolve(valueJson as number)
            })
            reject([])
        })
    }

    findByTvShowEpisodeIdAndUserId(episodeId: string, userId: string): Promise<MyTvShowEpisodeNeverWatch | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(MY_TV_SHOW_EPISODE_NEVER_WATCHS_NAME_OBJECT, { tv_show_episode_id: (new ObjectId(episodeId)), user_id: new ObjectId(userId) }).then(valueJson => {
                resolve(valueJson != null ? Object.assign(new MyTvShowEpisodeNeverWatch(), valueJson) : null)
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

    find(idOpen: string): Promise<MyTvShowEpisodeNeverWatch> {
        throw new Error("Method not implemented.")
    }

    create(userId: string, episodeId: string, seasonId: string, tvShowId: string, createdAtValue: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = SetMyTvShowEpisodeNeverWatchDB(new ObjectId(userId), (new ObjectId(episodeId)), (new ObjectId(seasonId)), (new ObjectId(tvShowId)), createdAtValue)
            await Database.insert(MY_TV_SHOW_EPISODE_NEVER_WATCHS_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    findAll(): Promise<MyTvShowEpisodeNeverWatch[]> {
        throw new Error("Method not implemented.")
    }
}