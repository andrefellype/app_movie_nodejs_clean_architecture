import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import { ObjectId } from 'mongodb'
import MovieDAO from '../data/movie/MovieDAO'
import DirectorDAO from '../data/director/DirectorDAO'
import ActorDAO from '../data/actor/ActorDAO'
import CategoryDAO from '../data/category/CategoryDAO'
import CountryDAO from '../data/country/CountryDAO'
import StreamDAO from '../data/stream/StreamDAO'
import { MovieGetObjectForJson } from '../domain/entity/movie/MovieConst'
import MyMovieDAO from '../data/myMovie/MyMovieDAO'
import MyMovieNeverWatchDAO from '../data/myMovieNeverWatch/MyMovieNeverWatchDAO'
import MyMovieController from './MyMovieController'

class MovieController {
    public async deleteMovieOtherInformation(idsInformation: string[], typeInformation: string) {
        if (typeInformation == "directors") {
            const movieDAO = new MovieDAO()
            await movieDAO.getAllByDirectorsId(idsInformation).then(async moviesJson => {
                const valuesUpdate: { data: object, idValue: object }[] = []
                for (let m = 0; m < moviesJson.length; m++) {
                    const directors = moviesJson[m].directors_id.filter(f => idsInformation.filter(i => i.toString() == f.toString()).length == 0)
                    valuesUpdate.push({ data: { directors_id: directors }, idValue: new ObjectId(moviesJson[m]._id) })
                }
                for (let v = 0; v < valuesUpdate.length; v++) {
                    movieDAO.updateByWhere(valuesUpdate[v].data, { _id: valuesUpdate[v].idValue })
                }
            })
        } else if (typeInformation == "casts") {
            const movieDAO = new MovieDAO()
            await movieDAO.getAllByCastsId(idsInformation).then(async moviesJson => {
                const valuesUpdate: { data: object, idValue: object }[] = []
                for (let m = 0; m < moviesJson.length; m++) {
                    const casts = moviesJson[m].casts_id.filter(f => idsInformation.filter(i => i.toString() == f.toString()).length == 0)
                    valuesUpdate.push({ data: { casts_id: casts }, idValue: new ObjectId(moviesJson[m]._id) })
                }
                for (let v = 0; v < valuesUpdate.length; v++) {
                    movieDAO.updateByWhere(valuesUpdate[v].data, { _id: valuesUpdate[v].idValue })
                }
            })
        } else if (typeInformation == "countries") {
            const movieDAO = new MovieDAO()
            await movieDAO.getAllByCountriesId(idsInformation).then(async moviesJson => {
                const valuesUpdate: { data: object, idValue: object }[] = []
                for (let m = 0; m < moviesJson.length; m++) {
                    const countries = moviesJson[m].countries_id.filter(f => idsInformation.filter(i => i.toString() == f.toString()).length == 0)
                    valuesUpdate.push({ data: { countries_id: countries }, idValue: new ObjectId(moviesJson[m]._id) })
                }
                for (let v = 0; v < valuesUpdate.length; v++) {
                    movieDAO.updateByWhere(valuesUpdate[v].data, { _id: valuesUpdate[v].idValue })
                }
            })
        } else if (typeInformation == "streams") {
            const movieDAO = new MovieDAO()
            await movieDAO.getAllByStreamsId(idsInformation).then(async moviesJson => {
                const valuesUpdate: { data: object, idValue: object }[] = []
                for (let m = 0; m < moviesJson.length; m++) {
                    const streams = moviesJson[m].streams_id.filter(f => idsInformation.filter(i => i.toString() == f.toString()).length == 0)
                    valuesUpdate.push({ data: { streams_id: streams }, idValue: new ObjectId(moviesJson[m]._id) })
                }
                for (let v = 0; v < valuesUpdate.length; v++) {
                    movieDAO.updateByWhere(valuesUpdate[v].data, { _id: valuesUpdate[v].idValue })
                }
            })
        }
    }

    public getAllByNotMyMovie(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const movieDAO = new MovieDAO()
                movieDAO.getAllByStatus(true).then(async valuesJson => {
                    let movies = valuesJson.map(vj => MovieGetObjectForJson(vj, req.userAuth))
                    movies = movies.filter(movie => movie.reviewed || (movie.user_register == req.userAuth._id))
                    for (let m = 0; m < movies.length; m++) {
                        await MovieController.getAllDetailsMovie(req, movies[m], true).then(valueMovie => {
                            movies[m] = valueMovie
                        })
                    }
                    movies = movies.filter(m => !m.mymovie && !m.neverwatch)
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, movies))
                }).catch(err => console.log(err))
            }
        })
    }

    private static async deleteMovie(idsMovie: string[], movieDAO: MovieDAO) {
        await movieDAO.getAllByIds(idsMovie).then(async valueJson => {
            const idsDelete = []
            const idsUpdate = []
            for (let v = 0; v < valueJson.length; v++) {
                if (!valueJson[v].reviewed) {
                    idsDelete.push((new ObjectId(valueJson[v]._id)))
                } else {
                    idsUpdate.push((new ObjectId(valueJson[v]._id)))
                }
            }
            await MyMovieController.deleteMyMovieAllByMovieId(idsDelete)
            await movieDAO.deleteAll({ _id: { $in: idsDelete } })
            await movieDAO.updateByWhere({ status: false, "updated_at": ConvertData.getDateNowStr() }, { _id: { $in: idsUpdate } })
        })
    }

    public deleteSeveral(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const ids = JSON.parse(req.body._ids)
                await MovieController.deleteMovie(ids, (new MovieDAO()))
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public delete(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                await MovieController.deleteMovie([req.body.movieId], (new MovieDAO()))
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public approved(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const movieDAO = new MovieDAO()
                movieDAO.updateByWhere({ reviewed: true, updated_at: ConvertData.getDateNowStr() }, { _id: new ObjectId(req.body.movieId) }).then(async valueUpdate => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                }).catch(err => console.log(err))
            }
        })
    }

    public update(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const movieDAO = new MovieDAO()
                const durationValue = `${req.body.duration}:00`
                const movieTheater = req.body.movieTheater == "YES"
                const categories = req.body.categories.map(ca => new ObjectId(ca))
                const directors = req.body.directors.map(di => new ObjectId(di))
                const casts = req.body.casts.map(ac => new ObjectId(ac))
                const countries = req.body.countries.map(co => new ObjectId(co))
                const streams = req.body.streams.map(st => new ObjectId(st))
                movieDAO.updateByWhere({
                    title: req.body.title, release: req.body.release, duration: durationValue, movie_theater: movieTheater,
                    resume: req.body.resume, categories_id: categories, directors_id: directors, casts_id: casts, countries_id: countries,
                    streams_id: streams, updated_at: ConvertData.getDateNowStr()
                }, { _id: new ObjectId(req.body.movieId) }).then(async valueUpdate => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                }).catch(err => console.log(err))
            }
        })
    }

    public openById(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const movieDAO = new MovieDAO()
                movieDAO.open(req.body.movieId).then(async valueJson => {
                    let movie = MovieGetObjectForJson(valueJson, req.userAuth)
                    await MovieController.getAllDetailsMovie(req, movie).then(valueDetails => movie = valueDetails)
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, movie))
                }).catch(err => console.log(err))
            }
        })
    }

    public create(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const movieDAO = new MovieDAO()

                const duration = `${req.body.duration}:00`
                const movieTheater = req.body.movieTheater == "YES"
                const reviewed = req.userAuth.level == "ADMIN"
                const categories = req.body.categories.map(ca => new ObjectId(ca))
                const directors = req.body.directors.map(di => new ObjectId(di))
                const casts = req.body.casts.map(ac => new ObjectId(ac))
                const countries = req.body.countries.map(co => new ObjectId(co))
                const streams = req.body.streams.map(st => new ObjectId(st))
                movieDAO.create(
                    req.body.title, req.body.release, duration, movieTheater, req.body.resume, categories, directors,
                    casts, countries, streams, req.userAuth._id, reviewed, ConvertData.getDateNowStr()).then(async valueId => {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueId))
                    }).catch(err => console.log(err))
            }
        })
    }

    public getAll(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const movieDAO = new MovieDAO()
                movieDAO.getAllByStatus(true).then(async valuesJson => {
                    let movies = valuesJson.map(vj => MovieGetObjectForJson(vj, req.userAuth))
                    if (req.userAuth.level != "ADMIN") {
                        movies = movies.filter(movie => movie.reviewed || (movie.user_register == req.userAuth._id))
                    }
                    for (let m = 0; m < movies.length; m++) {
                        await MovieController.getAllDetailsMovie(req, movies[m], false).then(valueMovie => {
                            movies[m] = valueMovie
                        })
                    }
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, movies))
                }).catch(err => console.log(err))
            }
        })
    }

    private static async getAllDetailsMovie(req, movie, validateNotMyMovie = false) {
        const directorDAO = new DirectorDAO()
        const actorDAO = new ActorDAO()
        const categoryDAO = new CategoryDAO()
        const countryDAO = new CountryDAO()
        const streamDAO = new StreamDAO()
        const myMovieDAO = new MyMovieDAO()
        const myMovieNeverWatchDAO = new MyMovieNeverWatchDAO()

        let statusMyMovie = true
        if (req.userAuth != null) {
            await myMovieDAO.openByMovieIdAndUserId(movie._id, req.userAuth._id).then(valueJsonMM => {
                movie.mymovie = valueJsonMM != null
                if (valueJsonMM != null) {
                    statusMyMovie = false
                }
            })
            await myMovieNeverWatchDAO.openByMovieIdAndUserId(movie._id, req.userAuth._id).then(valueJsonMN => {
                movie.neverwatch = valueJsonMN != null
                if (valueJsonMN != null) {
                    statusMyMovie = false
                }
            })
        }

        if (!validateNotMyMovie || statusMyMovie) {
            const movieCategories = []
            if (req.body.object == null || req.body.object.category) {
                for (let mca = 0; mca < movie.categories_id.length; mca++) {
                    await categoryDAO.open(movie.categories_id[mca]).then(valueJsonCategory => {
                        if (valueJsonCategory.status) {
                            movieCategories.push(valueJsonCategory)
                        }
                    })
                }
            }
            movie.categories = movieCategories

            const movieDirectors = []
            if (req.body.object == null || req.body.object.director) {
                for (let md = 0; md < movie.directors_id.length; md++) {
                    await directorDAO.open(movie.directors_id[md]).then(valueJsonDirector => {
                        if (valueJsonDirector.status) {
                            movieDirectors.push(valueJsonDirector)
                        }
                    })
                }
            }
            movie.directors = movieDirectors

            const movieCasts = []
            if (req.body.object == null || req.body.object.cast) {
                for (let mc = 0; mc < movie.casts_id.length; mc++) {
                    await actorDAO.open(movie.casts_id[mc]).then(valueJsonActor => {
                        if (valueJsonActor.status) {
                            movieCasts.push(valueJsonActor)
                        }
                    })
                }
            }
            movie.casts = movieCasts

            const movieCountries = []
            if (req.body.object == null || req.body.object.country) {
                for (let mco = 0; mco < movie.countries_id.length; mco++) {
                    await countryDAO.open(movie.countries_id[mco]).then(valueJsonCountry => {
                        if (valueJsonCountry.status) {
                            movieCountries.push(valueJsonCountry)
                        }
                    })
                }
            }
            movie.countries = movieCountries

            const movieStreams = []
            if (req.body.object == null || req.body.object.stream) {
                for (let ms = 0; ms < movie.streams_id.length; ms++) {
                    await streamDAO.open(movie.streams_id[ms]).then(valueJsonStream => {
                        if (valueJsonStream.status) {
                            movieStreams.push(valueJsonStream)
                        }
                    })
                }
            }
            movie.streams = movieStreams
        }
        return movie
    }
}

export default new MovieController()