import Database from "../../app/config/Database"
import { ObjectId } from "mongodb"
import CrudRepository from "../../domain/repository/CrudRepository"
import MyTvShowEpisode from "../../domain/entity/myTvShowEpisode/MyTvShowEpisode"
import MyTvShowEpisodeRepository from "../../domain/repository/myTvShowEpisode/MyTvShowEpisodeRepository"
import { MyTvShowEpisodeSetObjectDB, MY_TV_SHOW_EPISODES_NAME_OBJECT } from "../../domain/entity/myTvShowEpisode/MyTvShowEpisodeConst"

export default class MyTvShowEpisodeDAO implements MyTvShowEpisodeRepository, CrudRepository<MyTvShowEpisode> {
    countByTvShowIdAndUserId(tvShowId: string, userId: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            await Database.countByWhere(MY_TV_SHOW_EPISODES_NAME_OBJECT, { tv_show_id: (new ObjectId(tvShowId)), user_id: new ObjectId(userId) }).then(valueJson => {
                resolve(valueJson as number)
            })
            reject([])
        })
    }

    deleteAllByTvShowIds(tvShowIds: string[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const _ids = tvShowIds.map(i => new ObjectId(i))
            await Database.deleteByWhere(MY_TV_SHOW_EPISODES_NAME_OBJECT, { tv_show_id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    deleteAllByTvShowSeasonsIds(idSeasons: string[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const _ids = idSeasons.map(i => new ObjectId(i))
            await Database.deleteByWhere(MY_TV_SHOW_EPISODES_NAME_OBJECT, { tv_show_season_id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    deleteAllByTvShowEpisodeIds(idEpisodes: string[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const _ids = idEpisodes.map(i => new ObjectId(i))
            await Database.deleteByWhere(MY_TV_SHOW_EPISODES_NAME_OBJECT, { tv_show_episode_id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    deleteByTvShowIdAndUserIds(tvShowId: string, userId: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(MY_TV_SHOW_EPISODES_NAME_OBJECT, { tv_show_id: new ObjectId(tvShowId), user_id: new ObjectId(userId) }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    countByTvShowSeasonIdAndUserId(tvShowSeasonId: string, userId: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            await Database.countByWhere(MY_TV_SHOW_EPISODES_NAME_OBJECT, { tv_show_season_id: (new ObjectId(tvShowSeasonId)), user_id: new ObjectId(userId) }).then(valueJson => {
                resolve(valueJson as number)
            })
            reject([])
        })
    }

    openByTvShowEpisodeIdAndUserId(tvShowEpisodeId: string, userId: string): Promise<MyTvShowEpisode | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(MY_TV_SHOW_EPISODES_NAME_OBJECT, { tv_show_episode_id: (new ObjectId(tvShowEpisodeId)), user_id: new ObjectId(userId) }).then(valueJson => {
                resolve(valueJson != null ? Object.assign(new MyTvShowEpisode(), valueJson) : null)
            })
            reject([])
        })
    }

    getAllByUserId(userId: string): Promise<MyTvShowEpisode[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(MY_TV_SHOW_EPISODES_NAME_OBJECT, { user_id: new ObjectId(userId) }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new MyTvShowEpisode(), value)))
                }
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

    openById(idOpen: string): Promise<MyTvShowEpisode> {
        throw new Error("Method not implemented.")
    }

    create(userId: string, tvShowId: string, tvShowSeasonId: string, tvShowEpisodeId: string, createdAtValue: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = MyTvShowEpisodeSetObjectDB(new ObjectId(userId), new ObjectId(tvShowId), (new ObjectId(tvShowSeasonId)), (new ObjectId(tvShowEpisodeId)), createdAtValue)
            await Database.insert(MY_TV_SHOW_EPISODES_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    getAll(): Promise<MyTvShowEpisode[]> {
        throw new Error("Method not implemented.")
    }

}