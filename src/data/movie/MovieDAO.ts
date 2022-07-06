import CrudRepository from "../../domain/repository/CrudRepository"
import Movie from "../../domain/entity/movie/Movie"
import { SetMovieDB, MOVIE_NAME_OBJECT } from "../../domain/entity/movie/MovieConst"
import MovieRepository from "../../domain/repository/movie/MovieRepository"
import Database from "../../app/config/Database"
import { ObjectId } from "mongodb"

export default class MovieDAO implements MovieRepository, CrudRepository<Movie> {
    deleteAllByIds(ids: string[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const _ids = ids.map(i => new ObjectId(i))
            await Database.deleteByWhere(MOVIE_NAME_OBJECT, { _id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    findAllByIds(ids: string[]): Promise<Movie[]> {
        return new Promise(async (resolve, reject) => {
            const _ids = ids.map(i => new ObjectId(i))
            await Database.allByWhere(MOVIE_NAME_OBJECT, { _id: { $in: _ids } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Movie(), value)))
                }
            })
            reject([])
        })
    }

    findAllByStreamsIds(streamsIdValue: string[]): Promise<Movie[]> {
        return new Promise(async (resolve, reject) => {
            const _ids = streamsIdValue.map(i => new ObjectId(i))
            await Database.allByWhere(MOVIE_NAME_OBJECT, { streams_id: { $in: _ids } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Movie(), value)))
                }
            })
            reject([])
        })
    }

    findAllByCountriesIds(countriesIdValue: string[]): Promise<Movie[]> {
        return new Promise(async (resolve, reject) => {
            const _ids = countriesIdValue.map(i => new ObjectId(i))
            await Database.allByWhere(MOVIE_NAME_OBJECT, { countries_id: { $in: _ids } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Movie(), value)))
                }
            })
            reject([])
        })
    }

    findAllByCastsIds(castsIdValue: string[]): Promise<Movie[]> {
        return new Promise(async (resolve, reject) => {
            const _ids = castsIdValue.map(i => new ObjectId(i))
            await Database.allByWhere(MOVIE_NAME_OBJECT, { casts_id: { $in: _ids } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Movie(), value)))
                }
            })
            reject([])
        })
    }

    findAllByDirectorsIds(directorsIdValue: string[]): Promise<Movie[]> {
        return new Promise(async (resolve, reject) => {
            const _ids = directorsIdValue.map(i => new ObjectId(i))
            await Database.allByWhere(MOVIE_NAME_OBJECT, { directors_id: { $in: _ids } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Movie(), value)))
                }
            })
            reject([])
        })
    }

    findByTitle(titleValue: string): Promise<Movie | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(MOVIE_NAME_OBJECT, { title: titleValue }).then(value => {
                resolve(value != null ? Object.assign(new Movie(), value) : null)
            })
            reject(null)
        })
    }

    findAllByStatus(statusValue: boolean): Promise<Movie[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(MOVIE_NAME_OBJECT, { status: statusValue }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Movie(), value)))
                }
            })
            reject([])
        })
    }

    deleteById(idDelete: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(MOVIE_NAME_OBJECT, { _id: new ObjectId(idDelete) }).then(value => {
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
            await Database.updateByWhere(MOVIE_NAME_OBJECT, data, { _id: { $in: _ids } }).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    updateById(data: object, id: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.updateByWhere(MOVIE_NAME_OBJECT, data, { _id: (new ObjectId(id)) }).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    find(idOpen: string): Promise<Movie | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(MOVIE_NAME_OBJECT, { _id: new ObjectId(idOpen) }).then(value => {
                resolve(value != null ? Object.assign(new Movie(), value) : null)
            })
            reject(null)
        })
    }

    create(
        titleValue: string, releaseValue: string, durationValue: string, movieTheaterValue: boolean, resumeValue: string,
        categoriesValue: object[], directorsValue: object[], castsValue: object[], countriesValue: object[], streamsValue: object[],
        userRegister: string | null, reviewedValue: boolean, createdAtValue: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = SetMovieDB(
                titleValue, releaseValue, durationValue, movieTheaterValue, resumeValue,
                categoriesValue, directorsValue, castsValue, countriesValue, streamsValue,
                (userRegister != null ? new ObjectId(userRegister) : null), reviewedValue, true, createdAtValue)
            await Database.insert(MOVIE_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    findAll(): Promise<Movie[]> {
        throw new Error("Method not implemented.")
    }
}