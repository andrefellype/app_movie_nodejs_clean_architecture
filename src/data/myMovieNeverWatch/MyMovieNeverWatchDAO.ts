import Database from "../../app/config/Database"
import { ObjectId } from "mongodb"
import CrudRepository from "../../domain/repository/CrudRepository"
import MyMovieNeverWatch from "../../domain/entity/myMovieNeverWatch/MyMovieNeverWatch"
import { SetMyMovieNeverWatchDB, MY_MOVIE_NEVER_WATCHS_NAME_OBJECT } from "../../domain/entity/myMovieNeverWatch/MyMovieNeverWatchConst"
import MyMovieNeverWatchRepository from "../../domain/repository/myMovieNeverWatch/MyMovieNeverWatchRepository"

export default class MyMovieNeverWatchDAO implements MyMovieNeverWatchRepository, CrudRepository<MyMovieNeverWatch> {
    deleteAllByMovieIds(idMovies: string[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const _ids = idMovies.map(i => new ObjectId(i))
            await Database.deleteByWhere(MY_MOVIE_NEVER_WATCHS_NAME_OBJECT, { movie_id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    findByMovieIdAndUserId(movieId: string, userId: string): Promise<MyMovieNeverWatch | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(MY_MOVIE_NEVER_WATCHS_NAME_OBJECT, { movie_id: new ObjectId(movieId), user_id: new ObjectId(userId) }).then(valueJson => {
                resolve(valueJson != null ? Object.assign(new MyMovieNeverWatch(), valueJson) : null)
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
    
    find(idOpen: string): Promise<MyMovieNeverWatch> {
        throw new Error("Method not implemented.")
    }

    create(userId: string, movieId: string, createdAtValue: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = SetMyMovieNeverWatchDB(new ObjectId(userId), new ObjectId(movieId), createdAtValue)
            await Database.insert(MY_MOVIE_NEVER_WATCHS_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    findAll(): Promise<MyMovieNeverWatch[]> {
        throw new Error("Method not implemented.")
    }
}