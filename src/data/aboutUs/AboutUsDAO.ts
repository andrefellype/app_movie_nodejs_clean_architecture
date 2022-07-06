import Database from '../../app/config/Database'
import ConvertData from '../../app/core/ConvertData'
import AboutUs from '../../domain/entity/aboutUs/AboutUs'
import { SetAboutUsDB, ABOUT_US_NAME_OBJECT } from '../../domain/entity/aboutUs/AboutUsConst'
import AboutUsRepository from '../../domain/repository/aboutUs/AboutUsRepository'
import CrudRepository from '../../domain/repository/CrudRepository'

export default class AboutUsDAO implements AboutUsRepository, CrudRepository<AboutUs> {
    deleteAll(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.delete(ABOUT_US_NAME_OBJECT).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    updateAll(data: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.update(ABOUT_US_NAME_OBJECT, data).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    findLast(): Promise<AboutUs | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByLast(ABOUT_US_NAME_OBJECT).then(value => {
                resolve(value != null ? Object.assign(new AboutUs(), value) : null)
            })
            reject(null)
        })
    }

    deleteById(idDelete: string): Promise<boolean> {
        throw new Error('Method not implemented.')
    }

    updateByWhere(data: object, where: object): Promise<boolean> {
        throw new Error('Method not implemented.')
    }

    updateByIds(data: object, ids: string[]): Promise<boolean> {
        throw new Error('Method not implemented.')
    }

    updateById(data: object, id: string): Promise<boolean> {
        throw new Error('Method not implemented.')
    }
    
    find(idOpen: string): Promise<AboutUs | null> {
        throw new Error('Method not implemented.')
    }

    create(app: string, web: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = SetAboutUsDB(app, web, ConvertData.getDateNowStr())
            await Database.insert(ABOUT_US_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    findAll(): Promise<AboutUs[]> {
        throw new Error('Method not implemented.')
    }
}