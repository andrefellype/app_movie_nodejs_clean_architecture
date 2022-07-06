import { ObjectId } from "mongodb"
import Database from "../../app/config/Database"
import CrudRepository from "../../domain/repository/CrudRepository"
import Country from "../../domain/entity/country/Country"
import CountryRepository from "../../domain/repository/country/CountryRepository"
import { SetCountryDB, COUNTRY_NAME_OBJECT } from "../../domain/entity/country/CountryConst"

export default class CountryDAO implements CountryRepository, CrudRepository<Country> {
    deleteAllByIds(ids: string[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const _ids = ids.map(i => new ObjectId(i))
            await Database.deleteByWhere(COUNTRY_NAME_OBJECT, { _id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    findAllByIds(ids: string[]): Promise<Country[]> {
        return new Promise(async (resolve, reject) => {
            const _ids = ids.map(i => new ObjectId(i))
            await Database.allByWhere(COUNTRY_NAME_OBJECT, { _id: { $in: _ids } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Country(), value)))
                }
            })
            reject([])
        })
    }

    findByInitial(initialValue: string): Promise<Country | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(COUNTRY_NAME_OBJECT, { initial: initialValue }).then(value => {
                resolve(value != null ? Object.assign(new Country(), value) : null)
            })
            reject(null)
        })
    }

    findAllByStatus(statusValue: boolean): Promise<Country[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(COUNTRY_NAME_OBJECT, { status: statusValue }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Country(), value)))
                }
            })
            reject([])
        })
    }

    deleteById(idDelete: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(COUNTRY_NAME_OBJECT, { _id: new ObjectId(idDelete) }).then(value => {
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
            await Database.updateByWhere(COUNTRY_NAME_OBJECT, data, { _id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    updateById(data: object, id: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.updateByWhere(COUNTRY_NAME_OBJECT, data, { _id: (new ObjectId(id)) }).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    find(idOpen: string): Promise<Country | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(COUNTRY_NAME_OBJECT, { _id: new ObjectId(idOpen) }).then(value => {
                resolve(value != null ? Object.assign(new Country(), value) : null)
            })
            reject(null)
        })
    }

    create(initialValue: string, userRegister: string, reviewedValue: boolean, createdAtValue: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = SetCountryDB(initialValue, (new ObjectId(userRegister)), reviewedValue, true, createdAtValue)
            await Database.insert(COUNTRY_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    findAll(): Promise<Country[]> {
        throw new Error("Method not implemented.")
    }
}