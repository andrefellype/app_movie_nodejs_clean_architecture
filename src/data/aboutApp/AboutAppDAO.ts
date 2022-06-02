import Database from '../../app/config/Database'
import ConvertData from '../../app/core/ConvertData'
import AboutApp from '../../domain/entity/aboutApp/AboutApp'
import { AboutAppSetObjectDB, ABOUT_APP_NAME_OBJECT } from '../../domain/entity/aboutApp/AboutAppConst'
import AboutAppRepository from '../../domain/repository/aboutApp/AboutAppRepository'
import CrudRepository from '../../domain/repository/CrudRepository'

export default class AboutAppDAO implements AboutAppRepository, CrudRepository<AboutApp> {
    deleteAll(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.delete(ABOUT_APP_NAME_OBJECT).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    update(data: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.update(ABOUT_APP_NAME_OBJECT, data).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    openLast(): Promise<AboutApp> {
        return new Promise(async (resolve, reject) => {
            await Database.openByLast(ABOUT_APP_NAME_OBJECT).then(value => {
                resolve(value != null ? Object.assign(new AboutApp(), value) : null)
            })
            reject(null)
        })
    }

    create(app: string, web: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = AboutAppSetObjectDB(app, web, ConvertData.getDateNowStr(), null)
            await Database.insert(ABOUT_APP_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    delete(idDelete: string): Promise<boolean> {
        throw new Error('Method not implemented.')
    }

    updateByWhere(data: object, where: object): Promise<boolean> {
        throw new Error('Method not implemented.')
    }

    open(idOpen: string): Promise<AboutApp> {
        throw new Error('Method not implemented.')
    }

    getAll(): Promise<AboutApp[]> {
        throw new Error('Method not implemented.')
    }
}