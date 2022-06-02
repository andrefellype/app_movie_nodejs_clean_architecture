import { ObjectId } from "mongodb"
import Database from "../../app/config/Database"
import CrudRepository from "../../domain/repository/CrudRepository"
import Actor from "../../domain/entity/actor/Actor"
import ActorRepository from "../../domain/repository/actor/ActorRepository"
import { ActorSetObjectDB, ACTOR_NAME_OBJECT } from "../../domain/entity/actor/ActorConst"

export default class ActorDAO implements ActorRepository, CrudRepository<Actor> {
    deleteAll(where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(ACTOR_NAME_OBJECT, where).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    getAllByIds(ids: string[]): Promise<Actor[]> {
        return new Promise(async (resolve, reject) => {
            const _ids = ids.map(i => new ObjectId(i))
            await Database.allByWhere(ACTOR_NAME_OBJECT, { _id: { $in: _ids } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Actor(), value)))
                }
            })
            reject([])
        })
    }

    openByName(nameValue: string): Promise<Actor> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(ACTOR_NAME_OBJECT, { name: nameValue }).then(value => {
                resolve(value != null ? Object.assign(new Actor(), value) : null)
            })
            reject(null)
        })
    }

    getAllByStatus(statusValue: boolean): Promise<Actor[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(ACTOR_NAME_OBJECT, { status: statusValue }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Actor(), value)))
                }
            })
            reject([])
        })
    }

    delete(idDelete: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(ACTOR_NAME_OBJECT, { _id: new ObjectId(idDelete) }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    updateByWhere(data: object, where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.updateByWhere(ACTOR_NAME_OBJECT, data, where).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    open(idOpen: string): Promise<Actor> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(ACTOR_NAME_OBJECT, { _id: new ObjectId(idOpen) }).then(value => {
                resolve(value != null ? Object.assign(new Actor(), value) : null)
            })
            reject(null)
        })
    }

    create(nameValue: string, userRegister: string, reviewedValue: boolean, createdAtValue: string, updatedAtValue?: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = ActorSetObjectDB(nameValue, (new ObjectId(userRegister)), reviewedValue, true, createdAtValue, updatedAtValue)
            await Database.insert(ACTOR_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    getAll(): Promise<Actor[]> {
        throw new Error("Method not implemented.")
    }
}