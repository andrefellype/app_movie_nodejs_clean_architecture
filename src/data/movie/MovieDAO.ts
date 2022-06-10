import CrudRepository from "../../domain/repository/CrudRepository"
import Movie from "../../domain/entity/movie/Movie"
import { MovieSetObjectDB, MOVIE_NAME_OBJECT } from "../../domain/entity/movie/MovieConst"
import MovieRepository from "../../domain/repository/movie/MovieRepository"
import Database from "../../app/config/Database"
import { ObjectId } from "mongodb"

export default class MovieDAO implements MovieRepository, CrudRepository<Movie> {
    deleteAll(where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(MOVIE_NAME_OBJECT, where).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    getAllByIds(ids: string[]): Promise<Movie[]> {
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

    getAllByStreamsId(streamsIdValue: object[]): Promise<Movie[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(MOVIE_NAME_OBJECT, { streams_id: { $in: streamsIdValue } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Movie(), value)))
                }
            })
            reject([])
        })
    }

    getAllByCountriesId(countriesIdValue: object[]): Promise<Movie[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(MOVIE_NAME_OBJECT, { countries_id: { $in: countriesIdValue } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Movie(), value)))
                }
            })
            reject([])
        })
    }

    getAllByCastsId(castsIdValue: object[]): Promise<Movie[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(MOVIE_NAME_OBJECT, { casts_id: { $in: castsIdValue } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Movie(), value)))
                }
            })
            reject([])
        })
    }

    getAllByDirectorsId(directorsIdValue: object[]): Promise<Movie[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(MOVIE_NAME_OBJECT, { directors_id: { $in: directorsIdValue } }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Movie(), value)))
                }
            })
            reject([])
        })
    }

    openByTitle(titleValue: string): Promise<Movie | null> {
        return new Promise(async (resolve, reject) => {
            await Database.openByWhere(MOVIE_NAME_OBJECT, { title: titleValue }).then(value => {
                resolve(value != null ? Object.assign(new Movie(), value) : null)
            })
            reject(null)
        })
    }

    getAllByStatus(statusValue: boolean): Promise<Movie[]> {
        return new Promise(async (resolve, reject) => {
            await Database.allByWhere(MOVIE_NAME_OBJECT, { status: statusValue }).then(valueJson => {
                if (valueJson !== null) {
                    resolve((valueJson as []).map(value => Object.assign(new Movie(), value)))
                }
            })
            reject([])
        })
    }

    delete(idDelete: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.deleteByWhere(MOVIE_NAME_OBJECT, { _id: new ObjectId(idDelete) }).then(value => {
                resolve(true)
            })
            reject(null)
        })
    }

    updateByWhere(data: object, where: object): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await Database.updateByWhere(MOVIE_NAME_OBJECT, data, where).then(value => {
                resolve(true)
            })
            reject(false)
        })
    }

    open(idOpen: string): Promise<Movie | null> {
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
        userRegister: string | null, reviewedValue: boolean, createdAtValue: string, updatedAtValue?: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const objectDb = MovieSetObjectDB(
                titleValue, releaseValue, durationValue, movieTheaterValue, resumeValue,
                categoriesValue, directorsValue, castsValue, countriesValue, streamsValue,
                (userRegister != null ? new ObjectId(userRegister) : null), reviewedValue, true, createdAtValue, updatedAtValue)
            await Database.insert(MOVIE_NAME_OBJECT, objectDb).then(valueJson => {
                resolve(valueJson as string)
            })
            reject(null)
        })
    }

    getAll(): Promise<Movie[]> {
        throw new Error("Method not implemented.")
    }
}