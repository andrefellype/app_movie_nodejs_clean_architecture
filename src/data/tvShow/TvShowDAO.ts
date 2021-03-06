import CrudRepository from "../../domain/repository/CrudRepository"
import TvShowRepository from "../../domain/repository/tvShow/TvShowRepository"
import Database from "../../app/config/Database"
import { ObjectId } from "mongodb"
import TvShow from "../../domain/entity/tvShow/TvShow"
import { SetTvShowDB, TV_SHOW_NAME_OBJECT } from "../../domain/entity/tvShow/TvShowConst"

export default class TvShowDAO implements TvShowRepository, CrudRepository<TvShow> {
    deleteAllByIds(ids: string[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const _ids = ids.map(i => new ObjectId(i))
            await Database.deleteByWhere(TV_SHOW_NAME_OBJECT, { _id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    findAllByIds(ids: string[]): Promise<TvShow[]> {
        return new Promise(async (resolve, reject) => {
            const _ids = ids.map(i => new ObjectId(i))
            await Database.allByWhere(TV_SHOW_NAME_OBJECT, { _id: { $in: _ids } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new TvShow(), value)))
                }
            })
            reject([])
        })
    }

    findAllByStreamsIds(streamsIdValue: string[]): Promise<TvShow[]> {
        return new Promise(async (resolve, reject) => {
            const _ids = streamsIdValue.map(i => new ObjectId(i))
            await Database.allByWhere(TV_SHOW_NAME_OBJECT, { streams_id: { $in: _ids } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new TvShow(), value)))
                }
            })
            reject([])
        })
    }

    findAllByCountriesIds(countriesIdValue: string[]): Promise<TvShow[]> {
        return new Promise(async (resolve, reject) => {
            const _ids = countriesIdValue.map(i => new ObjectId(i))
            await Database.allByWhere(TV_SHOW_NAME_OBJECT, { countries_id: { $in: _ids } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new TvShow(), value)))
                }
            })
            reject([])
        })
    }

    findByTitle(titleValue: string): Promise<TvShow | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(TV_SHOW_NAME_OBJECT, { title: titleValue }).then(value => {
                resolve(value != null ? Object.assign(new TvShow(), value) : null)
            })
            reject(null)
        })
    }

    findAllByStatus(statusValue: boolean): Promise<TvShow[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(TV_SHOW_NAME_OBJECT, { status: statusValue }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new TvShow(), value)))
                }
            })
            reject([])
        })
    }

    deleteById(idDelete: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(TV_SHOW_NAME_OBJECT, { _id: new ObjectId(idDelete) }).then(value => {
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
            await Database.updateByWhere(TV_SHOW_NAME_OBJECT, data, { _id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    updateById(data: object, id: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.updateByWhere(TV_SHOW_NAME_OBJECT, data, { _id: (new ObjectId(id)) }).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    find(idOpen: string): Promise<TvShow | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(TV_SHOW_NAME_OBJECT, { _id: new ObjectId(idOpen) }).then(value => {
                resolve(value != null ? Object.assign(new TvShow(), value) : null)
            })
            reject(null)
        })
    }

    create(titleValue: string, releaseValue: string, resumeValue: string, categoriesIdValue: string[], countriesIdValue: string[], streamsIdValue: string[], userRegister: string | null, reviewedValue: boolean, createdAtValue: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = SetTvShowDB(titleValue, releaseValue, resumeValue, categoriesIdValue, countriesIdValue, streamsIdValue, (userRegister != null ? new ObjectId(userRegister) : null), reviewedValue, true, createdAtValue)
            await Database.insert(TV_SHOW_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    findAll(): Promise<TvShow[]> {
        throw new Error("Method not implemented.")
    }
}