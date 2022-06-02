import { ObjectId } from "mongodb"
import Database from "../../app/config/Database"
import User from "../../domain/entity/user/User"
import UserRepository from "../../domain/repository/user/UserRepository"
import CrudRepository from "../../domain/repository/CrudRepository"
import { UserSetObjectDB, USER_NAME_OBJECT } from "../../domain/entity/user/UserConst"

export default class UserDAO implements UserRepository, CrudRepository<User> {
    allByNotIdAndStatus(userIdValue: string, statusValue: boolean = true): Promise<User[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(USER_NAME_OBJECT, { status: statusValue, _id: { $ne: new ObjectId(userIdValue) } }).then(value => {
                if (value !== null) {
                    resolve((value as []).map(value => Object.assign(new User(), value)))
                }
            })
            reject([])
        })
    }

    openByCodeRecovery(codeRecoveryValue: string): Promise<User> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(USER_NAME_OBJECT, { code_recovery: codeRecoveryValue }).then(value => {
                resolve(value != null ? Object.assign(new User(), value) : null)
            })
            reject(null)
        })
    }

    openByCellphoneAndPassword(cellphoneValue: string, passwordValue: string): Promise<User> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(USER_NAME_OBJECT, { status: true, cellphone: cellphoneValue, password: passwordValue }).then(value => {
                resolve(value != null ? Object.assign(new User(), value) : null)
            })
            reject(null)
        })
    }

    openByCellphone(cellphoneValue: string): Promise<User> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(USER_NAME_OBJECT, { cellphone: cellphoneValue }).then(value => {
                resolve(value != null ? Object.assign(new User(), value) : null)
            })
            reject(null)
        })
    }

    delete(idDelete: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(USER_NAME_OBJECT, { _id: new ObjectId(idDelete) }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    updateByWhere(data: object, where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.updateByWhere(USER_NAME_OBJECT, data, where).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    open(idOpen: string): Promise<User> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(USER_NAME_OBJECT, { _id: new ObjectId(idOpen) }).then(value => {
                resolve(value != null ? Object.assign(new User(), value) : null)
            })
            reject(null)
        })
    }

    create(nameValue: string, birthValue: string, emailValue: string, cellphoneValue: string, passwordValue: string, levelValue: string, createdAtValue: string, updatedAtValue?: string, lastAccessAtValue?: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = UserSetObjectDB(nameValue, birthValue, emailValue, cellphoneValue, passwordValue, levelValue, null, true, true, createdAtValue, updatedAtValue, lastAccessAtValue)
            await Database.insert(USER_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    getAll(): Promise<User[]> {
        return new Promise(async (resolve, reject) => {
            await Database.all(USER_NAME_OBJECT).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new User(), value)))
                }
            })
            reject([])
        })
    }
}