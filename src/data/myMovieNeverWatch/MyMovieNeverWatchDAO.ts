import Database from "../../app/config/Database"
import { ObjectId } from "mongodb"
import CrudRepository from "../../domain/repository/CrudRepository"
import MyMovieNeverWatch from "../../domain/entity/myMovieNeverWatch/MyMovieNeverWatch"
import { MyMovieNeverWatchSetObjectDB, MY_MOVIE_NEVER_WATCHS_NAME_OBJECT } from "../../domain/entity/myMovieNeverWatch/MyMovieNeverWatchConst"
import MyMovieNeverWatchRepository from "../../domain/repository/myMovieNeverWatch/MyMovieNeverWatchRepository"

export default class MyMovieNeverWatchDAO implements MyMovieNeverWatchRepository, CrudRepository<MyMovieNeverWatch> {
    deleteAll(where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(MY_MOVIE_NEVER_WATCHS_NAME_OBJECT, where).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    openByMovieIdAndUserId(movieId: string, userId: string): Promise<MyMovieNeverWatch> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(MY_MOVIE_NEVER_WATCHS_NAME_OBJECT, { movie_id: new ObjectId(movieId), user_id: new ObjectId(userId) }).then(valueJson => {
                resolve(valueJson != null ? Object.assign(new MyMovieNeverWatch(), valueJson) : null)
            })
            reject([])
        })
    }

    delete(idDelete: string): Promise<boolean> {
        throw new Error("Method not implemented.")
    }
    updateByWhere(data: object, where: object): Promise<boolean> {
        throw new Error("Method not implemented.")
    }
    open(idOpen: string): Promise<MyMovieNeverWatch> {
        throw new Error("Method not implemented.")
    }

    create(userId: string, movieId: string, createdAtValue: string, updatedAtValue?: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = MyMovieNeverWatchSetObjectDB(new ObjectId(userId), new ObjectId(movieId), createdAtValue, updatedAtValue)
            await Database.insert(MY_MOVIE_NEVER_WATCHS_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    getAll(): Promise<MyMovieNeverWatch[]> {
        throw new Error("Method not implemented.")
    }

}