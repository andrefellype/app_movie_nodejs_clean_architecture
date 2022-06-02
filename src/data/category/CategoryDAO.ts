import { ObjectId } from "mongodb"
import Database from "../../app/config/Database"
import Category from "../../domain/entity/category/Category"
import CategoryRepository from "../../domain/repository/category/CategoryRepository"
import CrudRepository from "../../domain/repository/CrudRepository"
import { CategorySetObjectDB, CATEGORY_NAME_OBJECT } from "../../domain/entity/category/CategoryConst"

export default class CategoryDAO implements CategoryRepository, CrudRepository<Category> {
    openByName(nameValue: string): Promise<Category> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(CATEGORY_NAME_OBJECT, { name: nameValue }).then(value => {
                resolve(value != null ? Object.assign(new Category(), value) : null)
            })
            reject(null)
        })
    }

    getAllByStatus(statusValue: boolean): Promise<Category[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(CATEGORY_NAME_OBJECT, { status: statusValue }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Category(), value)))
                }
            })
            reject([])
        })
    }

    delete(idDelete: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(CATEGORY_NAME_OBJECT, { _id: new ObjectId(idDelete) }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    updateByWhere(data: object, where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.updateByWhere(CATEGORY_NAME_OBJECT, data, where).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    open(idOpen: string): Promise<Category> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(CATEGORY_NAME_OBJECT, { _id: new ObjectId(idOpen) }).then(value => {
                resolve(value != null ? Object.assign(new Category(), value) : null)
            })
            reject(null)
        })
    }

    create(nameValue: string, createdAtValue: string, updatedAtValue?: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = CategorySetObjectDB(nameValue, true, createdAtValue, updatedAtValue)
            await Database.insert(CATEGORY_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    getAll(): Promise<Category[]> {
        throw new Error("Method not implemented.")
    }
}