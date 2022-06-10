import CrudRepository from "../../domain/repository/CrudRepository"
import TvShowRepository from "../../domain/repository/tvShow/TvShowRepository"
import Database from "../../app/config/Database"
import { ObjectId } from "mongodb"
import TvShowSeasonRepository from "../../domain/repository/tvShowSeason/TvShowSeasonRepository"
import TvShowSeason from "../../domain/entity/tvShowSeason/TvShowSeason"
import { TvShowSeasonSetObjectDB, TV_SHOW_SEASON_NAME_OBJECT } from "../../domain/entity/tvShowSeason/TvShowSeasonConst"

export default class TvShowSeasonDAO implements TvShowSeasonRepository, CrudRepository<TvShowSeason> {
    getAllIdsByTvShowIdAndStatus(tvShowId: string, statusValue: boolean): Promise<TvShowSeason[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhereAndFields(TV_SHOW_SEASON_NAME_OBJECT, { tv_show_id: (new ObjectId(tvShowId)), status: statusValue }, null, { _id: 1 }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new TvShowSeason(), value)))
                }
            })
            reject([])
        })
    }

    getAllByTvShowId(tvShowIds: object[]): Promise<TvShowSeason[]> {
        return new Promise(async (resolve, reject) => {
            const _ids = tvShowIds
            await Database.allByWhere(TV_SHOW_SEASON_NAME_OBJECT, { tv_show_id: { $in: _ids } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new TvShowSeason(), value)))
                }
            })
            reject([])
        })
    }

    deleteAll(where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(TV_SHOW_SEASON_NAME_OBJECT, where).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    getAllByIds(ids: string[]): Promise<TvShowSeason[]> {
        return new Promise(async (resolve, reject) => {
            const _ids = ids.map(i => new ObjectId(i))
            await Database.allByWhere(TV_SHOW_SEASON_NAME_OBJECT, { _id: { $in: _ids } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new TvShowSeason(), value)))
                }
            })
            reject([])
        })
    }

    openByNameAndTvShowId(nameValue: string, tvShowId: string): Promise<TvShowSeason | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(TV_SHOW_SEASON_NAME_OBJECT, { name: nameValue, tv_show_id: (new ObjectId(tvShowId)) }).then(value => {
                resolve(value != null ? Object.assign(new TvShowSeason(), value) : null)
            })
            reject(null)
        })
    }

    getAllByTvShowIdAndStatus(tvShowId: string, statusValue: boolean): Promise<TvShowSeason[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(TV_SHOW_SEASON_NAME_OBJECT, { tv_show_id: (new ObjectId(tvShowId)), status: statusValue }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new TvShowSeason(), value)))
                }
            })
            reject([])
        })
    }

    delete(idDelete: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(TV_SHOW_SEASON_NAME_OBJECT, { _id: new ObjectId(idDelete) }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    updateByWhere(data: object, where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.updateByWhere(TV_SHOW_SEASON_NAME_OBJECT, data, where).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    open(idOpen: string): Promise<TvShowSeason | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(TV_SHOW_SEASON_NAME_OBJECT, { _id: new ObjectId(idOpen) }).then(value => {
                resolve(value != null ? Object.assign(new TvShowSeason(), value) : null)
            })
            reject(null)
        })
    }

    create(nameValue: string, tvShowId: string, userRegister: string | null, reviewedValue: boolean, createdAtValue: string, updatedAtValue?: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = TvShowSeasonSetObjectDB(nameValue, (new ObjectId(tvShowId)), (userRegister != null ? new ObjectId(userRegister) : null), reviewedValue, true, createdAtValue, updatedAtValue)
            await Database.insert(TV_SHOW_SEASON_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    getAll(): Promise<TvShowSeason[]> {
        throw new Error("Method not implemented.")
    }
}