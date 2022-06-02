import { ObjectId } from "mongodb"
import Database from "../../app/config/Database"
import CrudRepository from "../../domain/repository/CrudRepository"
import Stream from "../../domain/entity/stream/Stream"
import StreamRepository from "../../domain/repository/stream/StreamRepository"
import { StreamSetObjectDB, STREAM_NAME_OBJECT } from "../../domain/entity/stream/StreamConst"

export default class StreamDAO implements StreamRepository, CrudRepository<Stream> {
    deleteAll(where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(STREAM_NAME_OBJECT, where).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    getAllByIds(ids: string[]): Promise<Stream[]> {
        return new Promise(async (resolve, reject) => {
            const _ids = ids.map(i => new ObjectId(i))
            await Database.allByWhere(STREAM_NAME_OBJECT, { _id: { $in: _ids } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Stream(), value)))
                }
            })
            reject([])
        })
    }

    openByName(nameValue: string): Promise<Stream> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(STREAM_NAME_OBJECT, { name: nameValue }).then(value => {
                resolve(value != null ? Object.assign(new Stream(), value) : null)
            })
            reject(null)
        })
    }

    getAllByStatus(statusValue: boolean): Promise<Stream[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(STREAM_NAME_OBJECT, { status: statusValue }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Stream(), value)))
                }
            })
            reject([])
        })
    }

    delete(idDelete: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(STREAM_NAME_OBJECT, { _id: new ObjectId(idDelete) }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    updateByWhere(data: object, where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.updateByWhere(STREAM_NAME_OBJECT, data, where).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    open(idOpen: string): Promise<Stream> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(STREAM_NAME_OBJECT, { _id: new ObjectId(idOpen) }).then(value => {
                resolve(value != null ? Object.assign(new Stream(), value) : null)
            })
            reject(null)
        })
    }

    create(nameValue: string, userRegister: string, reviewedValue: boolean, createdAtValue: string, updatedAtValue?: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = StreamSetObjectDB(nameValue, (new ObjectId(userRegister)), reviewedValue, true, createdAtValue, updatedAtValue)
            await Database.insert(STREAM_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    getAll(): Promise<Stream[]> {
        throw new Error("Method not implemented.")
    }
}