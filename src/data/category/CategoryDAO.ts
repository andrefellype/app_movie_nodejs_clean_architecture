import { ObjectId } from "mongodb"
import Database from "../../app/config/Database"
import Category from "../../domain/entity/category/Category"
import CategoryRepository from "../../domain/repository/category/CategoryRepository"
import CrudRepository from "../../domain/repository/CrudRepository"
import { CategorySetObjectDB, CATEGORY_NAME_OBJECT } from "../../domain/entity/category/CategoryConst"

export default class CategoryDAO implements CategoryRepository, CrudRepository<Category> {
    openByName(nameValue: string): Promise<Category | null> {
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

    deleteById(idDelete: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(CATEGORY_NAME_OBJECT, { _id: new ObjectId(idDelete) }).then(value => {
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
            await Database.updateByWhere(CATEGORY_NAME_OBJECT, data, { _id: { $in: _ids }}).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    updateById(data: object, id: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.updateByWhere(CATEGORY_NAME_OBJECT, data, { _id: (new ObjectId(id)) }).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    openById(idOpen: string): Promise<Category | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(CATEGORY_NAME_OBJECT, { _id: new ObjectId(idOpen) }).then(value => {
                resolve(value != null ? Object.assign(new Category(), value) : null)
            })
            reject(null)
        })
    }

    create(nameValue: string, createdAtValue: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = CategorySetObjectDB(nameValue, true, createdAtValue)
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