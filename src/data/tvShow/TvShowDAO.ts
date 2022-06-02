import CrudRepository from "../../domain/repository/CrudRepository"
import TvShowRepository from "../../domain/repository/tvShow/TvShowRepository"
import Database from "../../app/config/Database"
import { ObjectId } from "mongodb"
import TvShow from "../../domain/entity/tvShow/TvShow"
import { TvShowSetObjectDB, TV_SHOW_NAME_OBJECT } from "../../domain/entity/tvShow/TvShowConst"

export default class TvShowDAO implements TvShowRepository, CrudRepository<TvShow> {
    deleteAll(where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(TV_SHOW_NAME_OBJECT, where).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    getAllByIds(ids: string[]): Promise<TvShow[]> {
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

    getAllByStreamsId(streamsIdValue: string[]): Promise<TvShow[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(TV_SHOW_NAME_OBJECT, { streams_id: { $in: streamsIdValue } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new TvShow(), value)))
                }
            })
            reject([])
        })
    }

    getAllByCountriesId(countriesIdValue: string[]): Promise<TvShow[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(TV_SHOW_NAME_OBJECT, { countries_id: { $in: countriesIdValue } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new TvShow(), value)))
                }
            })
            reject([])
        })
    }

    openByTitle(titleValue: string): Promise<TvShow> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(TV_SHOW_NAME_OBJECT, { title: titleValue }).then(value => {
                resolve(value != null ? Object.assign(new TvShow(), value) : null)
            })
            reject(null)
        })
    }

    getAllByStatus(statusValue: boolean): Promise<TvShow[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(TV_SHOW_NAME_OBJECT, { status: statusValue }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new TvShow(), value)))
                }
            })
            reject([])
        })
    }

    delete(idDelete: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(TV_SHOW_NAME_OBJECT, { _id: new ObjectId(idDelete) }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    updateByWhere(data: object, where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.updateByWhere(TV_SHOW_NAME_OBJECT, data, where).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    open(idOpen: string): Promise<TvShow> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(TV_SHOW_NAME_OBJECT, { _id: new ObjectId(idOpen) }).then(value => {
                resolve(value != null ? Object.assign(new TvShow(), value) : null)
            })
            reject(null)
        })
    }

    create(titleValue: string, releaseValue: string, resumeValue: string, categoriesIdValue: string[], countriesIdValue: string[], streamsIdValue: string[], userRegister: string | null, reviewedValue: boolean, createdAtValue: string, updatedAtValue?: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = TvShowSetObjectDB(titleValue, releaseValue, resumeValue, categoriesIdValue, countriesIdValue, streamsIdValue, (userRegister != null ? new ObjectId(userRegister) : null), reviewedValue, true, createdAtValue, updatedAtValue)
            await Database.insert(TV_SHOW_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    getAll(): Promise<TvShow[]> {
        throw new Error("Method not implemented.")
    }
}