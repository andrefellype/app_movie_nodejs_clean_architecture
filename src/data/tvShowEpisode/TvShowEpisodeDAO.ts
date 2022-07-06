import CrudRepository from "../../domain/repository/CrudRepository"
import Database from "../../app/config/Database"
import { ObjectId } from "mongodb"
import { SetTvShowEpisodeDB, TV_SHOW_EPISODES_NAME_OBJECT } from "../../domain/entity/tvShowEpisode/TvShowEpisodeConst"
import TvShowEpisode from "../../domain/entity/tvShowEpisode/TvShowEpisode"
import TvShowEpisodeRepository from "../../domain/repository/tvShowEpisode/TvShowEpisodeRepository"

export default class TvShowEpisodeDAO implements TvShowEpisodeRepository, CrudRepository<TvShowEpisode> {
    countAllByTvShowSeasonIdsAndStatus(tvShowSeasonIds: string[], statusValue: boolean): Promise<number> {
        const idsSeason = tvShowSeasonIds.map(t => new ObjectId(t))
        return new Promise(async (resolve, reject) => {
            await Database.countByWhere(TV_SHOW_EPISODES_NAME_OBJECT, { tv_show_season_id: { $in: idsSeason }, status: statusValue }).then(valueJson => {
                resolve(valueJson as number)
            })
            reject([])
        })
    }

    findAllByTvShowSeasonIds(seasonIds: string[]): Promise<TvShowEpisode[]> {
        return new Promise(async (resolve, reject) => {
            const _ids = seasonIds.map(i => new ObjectId(i))
            await Database.allByWhere(TV_SHOW_EPISODES_NAME_OBJECT, { tv_show_season_id: { $in: _ids } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new TvShowEpisode(), value)))
                }
            })
            reject([])
        })
    }

    deleteAllByIds(ids: string[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const _ids = ids.map(i => new ObjectId(i))
            await Database.deleteByWhere(TV_SHOW_EPISODES_NAME_OBJECT, { _id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    findAllByIds(ids: string[]): Promise<TvShowEpisode[]> {
        return new Promise(async (resolve, reject) => {
            const _ids = ids.map(i => new ObjectId(i))
            await Database.allByWhere(TV_SHOW_EPISODES_NAME_OBJECT, { _id: { $in: _ids } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new TvShowEpisode(), value)))
                }
            })
            reject([])
        })
    }

    countAllByTvShowSeasonIdAndStatus(tvShowSeasonId: string, statusValue: boolean): Promise<number> {
        return new Promise(async (resolve, reject) => {
            await Database.countByWhere(TV_SHOW_EPISODES_NAME_OBJECT, { tv_show_season_id: (new ObjectId(tvShowSeasonId)), status: statusValue }).then(valueJson => {
                resolve(valueJson as number)
            })
            reject([])
        })
    }

    findByNameAndTvShowSeasonId(nameValue: string, tvShowSeasonId: string): Promise<TvShowEpisode | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(TV_SHOW_EPISODES_NAME_OBJECT, { name: nameValue, tv_show_season_id: (new ObjectId(tvShowSeasonId)) }).then(value => {
                resolve(value != null ? Object.assign(new TvShowEpisode(), value) : null)
            })
            reject(null)
        })
    }

    findAllByTvShowSeasonIdAndStatus(tvShowSeasonId: string, statusValue: boolean): Promise<TvShowEpisode[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(TV_SHOW_EPISODES_NAME_OBJECT, { tv_show_season_id: (new ObjectId(tvShowSeasonId)), status: statusValue }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new TvShowEpisode(), value)))
                }
            })
            reject([])
        })
    }

    deleteById(idDelete: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(TV_SHOW_EPISODES_NAME_OBJECT, { _id: new ObjectId(idDelete) }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    updateByWhere(data: object, where: object): Promise<boolean> {
        throw new Error("Method not implemented.")
    }

    updateByIds(data: object, ids: string[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const _ids = ids.map(i => new ObjectId(i))
            await Database.updateByWhere(TV_SHOW_EPISODES_NAME_OBJECT, data, { _id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    updateById(data: object, id: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.updateByWhere(TV_SHOW_EPISODES_NAME_OBJECT, data, { _id: (new ObjectId(id)) }).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    find(idOpen: string): Promise<TvShowEpisode | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(TV_SHOW_EPISODES_NAME_OBJECT, { _id: new ObjectId(idOpen) }).then(value => {
                resolve(value != null ? Object.assign(new TvShowEpisode(), value) : null)
            })
            reject(null)
        })
    }

    create(nameValue: string, tvShowSeasonId: string, userRegister: string | null, reviewedValue: boolean, createdAtValue: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = SetTvShowEpisodeDB(nameValue, (new ObjectId(tvShowSeasonId)), (userRegister != null ? new ObjectId(userRegister) : null), reviewedValue, true, createdAtValue)
            await Database.insert(TV_SHOW_EPISODES_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    findAll(): Promise<TvShowEpisode[]> {
        throw new Error("Method not implemented.")
    }
}