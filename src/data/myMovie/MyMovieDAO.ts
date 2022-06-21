import Database from "../../app/config/Database"
import { ObjectId } from "mongodb"
import CrudRepository from "../../domain/repository/CrudRepository"
import MyMovie from "../../domain/entity/myMovie/MyMovie"
import MyMovieRepository from "../../domain/repository/myMovie/MyMovieRepository"
import { MyMovieSetObjectDB, MY_MOVIES_NAME_OBJECT } from "../../domain/entity/myMovie/MyMovieConst"

export default class MyMovieDAO implements MyMovieRepository, CrudRepository<MyMovie> {
    deleteAllByMovieIds(idMovies: string[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const _ids = idMovies.map(i => new ObjectId(i))
            await Database.deleteByWhere(MY_MOVIES_NAME_OBJECT, { movie_id: { $in: _ids }}).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    deleteByMovieIdAndUserId(movieId: string, userId: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(MY_MOVIES_NAME_OBJECT, { movie_id: new ObjectId(movieId), user_id: new ObjectId(userId) }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    openByMovieIdAndUserId(movieId: string, userId: string): Promise<MyMovie | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(MY_MOVIES_NAME_OBJECT, { movie_id: new ObjectId(movieId), user_id: new ObjectId(userId) }).then(valueJson => {
                resolve(valueJson != null ? Object.assign(new MyMovie(), valueJson) : null)
            })
            reject([])
        })
    }

    getAllByUserId(userId: string): Promise<MyMovie[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(MY_MOVIES_NAME_OBJECT, { user_id: new ObjectId(userId) }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new MyMovie(), value)))
                }
            })
            reject([])
        })
    }

    deleteById(idDelete: string): Promise<boolean> {
        throw new Error("Method not implemented.")
    }
    updateByWhere(data: object, where: object): Promise<boolean> {
        throw new Error("Method not implemented.")
    }
    updateByIds(data: object, ids: string[]): Promise<boolean> {
        throw new Error("Method not implemented.")
    }
    updateById(data: object, id: string): Promise<boolean> {
        throw new Error("Method not implemented.")
    }
    openById(idOpen: string): Promise<MyMovie> {
        throw new Error("Method not implemented.")
    }

    create(userId: string, movieId: string, createdAtValue: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = MyMovieSetObjectDB(new ObjectId(userId), new ObjectId(movieId), createdAtValue)
            await Database.insert(MY_MOVIES_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    getAll(): Promise<MyMovie[]> {
        throw new Error("Method not implemented.")
    }

}