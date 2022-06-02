import { ObjectId } from "mongodb"
import Database from "../../app/config/Database"
import DirectorRepository from "../../domain/repository/director/DirectorRepository"
import CrudRepository from "../../domain/repository/CrudRepository"
import { DirectorSetObjectDB, DIRECTOR_NAME_OBJECT } from "../../domain/entity/director/DirectorConst"
import Director from "../../domain/entity/director/Director"

export default class DirectorDAO implements DirectorRepository, CrudRepository<Director> {
    deleteAll(where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(DIRECTOR_NAME_OBJECT, where).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    getAllByIds(ids: string[]): Promise<Director[]> {
        return new Promise(async (resolve, reject) => {
            const _ids = ids.map(i => new ObjectId(i))
            await Database.allByWhere(DIRECTOR_NAME_OBJECT, { _id: { $in: _ids } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Director(), value)))
                }
            })
            reject([])
        })
    }

    openByName(nameValue: string): Promise<Director> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(DIRECTOR_NAME_OBJECT, { name: nameValue }).then(value => {
                resolve(value != null ? Object.assign(new Director(), value) : null)
            })
            reject(null)
        })
    }

    getAllByStatus(statusValue: boolean): Promise<Director[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(DIRECTOR_NAME_OBJECT, { status: statusValue }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Director(), value)))
                }
            })
            reject([])
        })
    }

    delete(idDelete: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(DIRECTOR_NAME_OBJECT, { _id: new ObjectId(idDelete) }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    updateByWhere(data: object, where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.updateByWhere(DIRECTOR_NAME_OBJECT, data, where).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    open(idOpen: string): Promise<Director> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(DIRECTOR_NAME_OBJECT, { _id: new ObjectId(idOpen) }).then(value => {
                resolve(value != null ? Object.assign(new Director(), value) : null)
            })
            reject(null)
        })
    }

    create(nameValue: string, userRegister: string, reviewedValue: boolean, createdAtValue: string, updatedAtValue?: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = DirectorSetObjectDB(nameValue, (new ObjectId(userRegister)), reviewedValue, true, createdAtValue, updatedAtValue)
            await Database.insert(DIRECTOR_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    getAll(): Promise<Director[]> {
        throw new Error("Method not implemented.")
    }
}