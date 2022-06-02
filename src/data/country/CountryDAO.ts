import { ObjectId } from "mongodb"
import Database from "../../app/config/Database"
import CrudRepository from "../../domain/repository/CrudRepository"
import Country from "../../domain/entity/country/Country"
import CountryRepository from "../../domain/repository/country/CountryRepository"
import { CountrySetObjectDB, COUNTRY_NAME_OBJECT } from "../../domain/entity/country/CountryConst"

export default class CountryDAO implements CountryRepository, CrudRepository<Country> {
    deleteAll(where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(COUNTRY_NAME_OBJECT, where).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    getAllByIds(ids: string[]): Promise<Country[]> {
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

    openByName(nameValue: string): Promise<Country> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(COUNTRY_NAME_OBJECT, { name: nameValue }).then(value => {
                resolve(value != null ? Object.assign(new Country(), value) : null)
            })
            reject(null)
        })
    }

    getAllByStatus(statusValue: boolean): Promise<Country[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(COUNTRY_NAME_OBJECT, { status: statusValue }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Country(), value)))
                }
            })
            reject([])
        })
    }

    delete(idDelete: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(COUNTRY_NAME_OBJECT, { _id: new ObjectId(idDelete) }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    updateByWhere(data: object, where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.updateByWhere(COUNTRY_NAME_OBJECT, data, where).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    open(idOpen: string): Promise<Country> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(COUNTRY_NAME_OBJECT, { _id: new ObjectId(idOpen) }).then(value => {
                resolve(value != null ? Object.assign(new Country(), value) : null)
            })
            reject(null)
        })
    }

    create(nameValue: string, userRegister: string, reviewedValue: boolean, createdAtValue: string, updatedAtValue?: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = CountrySetObjectDB(nameValue, (new ObjectId(userRegister)), reviewedValue, true, createdAtValue, updatedAtValue)
            await Database.insert(COUNTRY_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    getAll(): Promise<Country[]> {
        throw new Error("Method not implemented.")
    }
}