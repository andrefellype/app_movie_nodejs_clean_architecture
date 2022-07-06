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
import { GetMovieByJson } from '../domain/entity/movie/MovieConst'
import Category from '../domain/entity/category/Category'
import Director from '../domain/entity/director/Director'
import Actor from '../domain/entity/actor/Actor'
import Country from '../domain/entity/country/Country'
import Stream from '../domain/entity/stream/Stream'
import MyMovieNeverWatchDAO from '../data/myMovieNeverWatch/MyMovieNeverWatchDAO'
import MyMovieDAO from '../data/myMovie/MyMovieDAO'
import MyMovieController from './MyMovieController'
import MyMovieNeverWatchController from './MyMovieNeverWatchController'

class MovieController {
    public async deleteAllInformationMovie(idsInformation: string[], typeInformation: string) {
        if (typeInformation == "directors") {
            const movieDAO = new MovieDAO()
            await movieDAO.findAllByDirectorsIds(idsInformation).then(async moviesJson => {
                const valuesUpdate: { data: object, idValue: string }[] = []
                for (let m = 0; m < moviesJson.length; m++) {
                    const directors = moviesJson[m].directors_id.filter(f => idsInformation.filter(i => i.toString() == f.toString()).length == 0)
                    valuesUpdate.push({ data: { directors_id: directors }, idValue: moviesJson[m]._id })
                }
                for (let v = 0; v < valuesUpdate.length; v++) {
                    movieDAO.updateById(valuesUpdate[v].data, valuesUpdate[v].idValue)
                }
            })
        } else if (typeInformation == "casts") {
            const movieDAO = new MovieDAO()
            await movieDAO.findAllByCastsIds(idsInformation).then(async moviesJson => {
                const valuesUpdate: { data: object, idValue: string }[] = []
                for (let m = 0; m < moviesJson.length; m++) {
                    const casts = moviesJson[m].casts_id.filter(f => idsInformation.filter(i => i.toString() == f.toString()).length == 0)
                    valuesUpdate.push({ data: { casts_id: casts }, idValue: moviesJson[m]._id })
                }
                for (let v = 0; v < valuesUpdate.length; v++) {
                    movieDAO.updateById(valuesUpdate[v].data, valuesUpdate[v].idValue)
                }
            })
        } else if (typeInformation == "countries") {
            const movieDAO = new MovieDAO()
            await movieDAO.findAllByCountriesIds(idsInformation).then(async moviesJson => {
                const valuesUpdate: { data: object, idValue: string }[] = []
                for (let m = 0; m < moviesJson.length; m++) {
                    const countries = moviesJson[m].countries_id.filter(f => idsInformation.filter(i => i.toString() == f.toString()).length == 0)
                    valuesUpdate.push({ data: { countries_id: countries }, idValue: moviesJson[m]._id })
                }
                for (let v = 0; v < valuesUpdate.length; v++) {
                    movieDAO.updateById(valuesUpdate[v].data, valuesUpdate[v].idValue)
                }
            })
        } else if (typeInformation == "streams") {
            const movieDAO = new MovieDAO()
            await movieDAO.findAllByStreamsIds(idsInformation).then(async moviesJson => {
                const valuesUpdate: { data: object, idValue: string }[] = []
                for (let m = 0; m < moviesJson.length; m++) {
                    const streams = moviesJson[m].streams_id.filter(f => idsInformation.filter(i => i.toString() == f.toString()).length == 0)
                    valuesUpdate.push({ data: { streams_id: streams }, idValue: moviesJson[m]._id })
                }
                for (let v = 0; v < valuesUpdate.length; v++) {
                    movieDAO.updateById(valuesUpdate[v].data, valuesUpdate[v].idValue)
                }
            })
        }
    }

    public openAllByNotMyMovie(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const movieDAO = new MovieDAO()
                movieDAO.findAllByStatus(true).then(async valuesJson => {
                    let movies = valuesJson.map(vj => GetMovieByJson(vj, req.userAuth))
                    movies = movies.filter(movie => movie.reviewed || (movie.user_register == req.userAuth._id))
                    for (let m = 0; m < movies.length; m++) {
                        await MovieController.openAllDetailMovie(req, movies[m], true, false).then(valueMovie => {
                            movies[m] = valueMovie
                        })
                    }
                    movies = movies.filter(m => !m.mymovie && !m.neverwatch)
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, movies))
                }).catch(err => console.log(err))
            }
        })
    }

    private static async deleteLocalByIds(idsMovie: string[], movieDAO: MovieDAO) {
        await movieDAO.findAllByIds(idsMovie).then(async valueJson => {
            const idsDelete: string[] = []
            const idsUpdate: string[] = []
            for (let v = 0; v < valueJson.length; v++) {
                if (!valueJson[v].reviewed) {
                    idsDelete.push(valueJson[v]._id)
                } else {
                    idsUpdate.push(valueJson[v]._id)
                }
            }
            await MyMovieController.deleteAllByMovieIds(idsDelete)
            await MyMovieNeverWatchController.deleteAllByMovieIds(idsDelete)
            await movieDAO.deleteAllByIds(idsDelete)
            await movieDAO.updateByIds({ status: false, "updated_at": ConvertData.getDateNowStr() }, idsUpdate)
        })
    }

    public deleteById(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                let movieIds: string[] = []
                if (typeof req.route.methods.put != "undefined" && req.route.methods.put) {
                    movieIds = JSON.parse(req.body.movieId)
                } else {
                    movieIds.push(req.params.movieId)
                }
                await MovieController.deleteLocalByIds(movieIds, (new MovieDAO()))
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public updateApprovedById(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const movieDAO = new MovieDAO()
                movieDAO.updateById({ reviewed: true, updated_at: ConvertData.getDateNowStr() },
                    req.params.movieId).then(async valueUpdate => {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                    }).catch(err => console.log(err))
            }
        })
    }

    public updateById(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const movieDAO = new MovieDAO()
                const durationValue = `${req.body.duration}:00`
                const movieTheater = req.body.movieTheater == "YES"
                const categories = req.body.categories.map(ca => new ObjectId(ca))
                const directors = req.body.directors.map(di => new ObjectId(di))
                const casts = req.body.casts.map(ac => new ObjectId(ac))
                const countries = req.body.countries.map(co => new ObjectId(co))
                const streams = req.body.streams.map(st => new ObjectId(st))
                movieDAO.updateById({
                    title: req.body.title, release: req.body.release, duration: durationValue,
                    movie_theater: movieTheater, resume: req.body.resume, categories_id: categories,
                    directors_id: directors, casts_id: casts, countries_id: countries, streams_id: streams,
                    updated_at: ConvertData.getDateNowStr()
                }, req.params.movieId).then(async valueUpdate => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                }).catch(err => console.log(err))
            }
        })
    }

    public openById(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const movieDAO = new MovieDAO()
                movieDAO.find(req.params.movieId).then(async valueJson => {
                    let movie = GetMovieByJson(valueJson!!, req.userAuth)
                    await MovieController.openAllDetailMovie(req, movie).then(valueDetails => movie = valueDetails)
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, movie))
                }).catch(err => console.log(err))
            }
        })
    }

    public create(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
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

    public openMovieDetailAll(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const movieDAO = new MovieDAO()
                movieDAO.findAllByIds(req.body.movieIds).then(async valuesJson => {
                    let movies = valuesJson.map(vj => GetMovieByJson(vj, req.userAuth))
                    for (let m = 0; m < movies.length; m++) {
                        await MovieController.openAllDetailMovie(req, movies[m]).then(valueMovie => {
                            movies[m] = valueMovie
                        })
                    }
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, movies))
                }).catch(err => console.log(err))
            }
        })
    }

    public openAll(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const movieDAO = new MovieDAO()
                movieDAO.findAllByStatus(true).then(async valuesJson => {
                    let movies = valuesJson.map(vj => GetMovieByJson(vj, req.userAuth))
                    if (req.userAuth.level != "ADMIN") {
                        movies = movies.filter(movie => movie.reviewed || (movie.user_register == req.userAuth._id))
                    }
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, movies))
                }).catch(err => console.log(err))
            }
        })
    }

    private static async openAllDetailMovie(req, movie, validateNotMyMovie = false, viewDetails = true) {
        const directorDAO = new DirectorDAO()
        const actorDAO = new ActorDAO()
        const categoryDAO = new CategoryDAO()
        const countryDAO = new CountryDAO()
        const streamDAO = new StreamDAO()
        const myMovieDAO = new MyMovieDAO()
        const myMovieNeverWatchDAO = new MyMovieNeverWatchDAO()

        let statusMyMovie = true
        if (req.userAuth != null) {
            await myMovieDAO.findByMovieIdAndUserId(movie._id, req.userAuth._id).then(valueJsonMM => {
                movie.mymovie = valueJsonMM != null
                if (valueJsonMM != null) {
                    statusMyMovie = false
                }
            })
            await myMovieNeverWatchDAO.findByMovieIdAndUserId(movie._id, req.userAuth._id).then(valueJsonMN => {
                movie.neverwatch = valueJsonMN != null
                if (valueJsonMN != null) {
                    statusMyMovie = false
                }
            })
        }

        if (viewDetails && (!validateNotMyMovie || statusMyMovie)) {
            const movieCategories: Category[] = []
            for (let mca = 0; mca < movie.categories_id.length; mca++) {
                await categoryDAO.find(movie.categories_id[mca]).then(valueJsonCategory => {
                    if (valueJsonCategory!!.status) {
                        movieCategories.push(valueJsonCategory!!)
                    }
                })
            }
            movie.categories = movieCategories

            const movieDirectors: Director[] = []
            for (let md = 0; md < movie.directors_id.length; md++) {
                await directorDAO.find(movie.directors_id[md]).then(valueJsonDirector => {
                    if (valueJsonDirector!!.status) {
                        movieDirectors.push(valueJsonDirector!!)
                    }
                })
            }
            movie.directors = movieDirectors

            const movieCasts: Actor[] = []
            for (let mc = 0; mc < movie.casts_id.length; mc++) {
                await actorDAO.find(movie.casts_id[mc]).then(valueJsonActor => {
                    let statusActor = valueJsonActor!!.status
                    if (req.userAuth.level != "ADMIN" && !valueJsonActor!!.reviewed && valueJsonActor!!.user_register != req.userAuth._id) {
                        statusActor = false
                    }
                    if (statusActor) {
                        movieCasts.push(valueJsonActor!!)
                    }
                })
            }
            movie.casts = movieCasts

            const movieCountries: Country[] = []
            for (let mco = 0; mco < movie.countries_id.length; mco++) {
                await countryDAO.find(movie.countries_id[mco]).then(valueJsonCountry => {
                    let statusCountry = valueJsonCountry!!.status
                    if (req.userAuth.level != "ADMIN" && !valueJsonCountry!!.reviewed && valueJsonCountry!!.user_register != req.userAuth._id) {
                        statusCountry = false
                    }
                    if (statusCountry) {
                        movieCountries.push(valueJsonCountry!!)
                    }
                })
            }
            movie.countries = movieCountries

            const movieStreams: Stream[] = []
            for (let ms = 0; ms < movie.streams_id.length; ms++) {
                await streamDAO.find(movie.streams_id[ms]).then(valueJsonStream => {
                    let statusStream = valueJsonStream!!.status
                    if (req.userAuth.level != "ADMIN" && !valueJsonStream!!.reviewed && valueJsonStream!!.user_register != req.userAuth._id) {
                        statusStream = false
                    }
                    if (statusStream) {
                        movieStreams.push(valueJsonStream!!)
                    }
                })
            }
            movie.streams = movieStreams
        }
        return movie
    }
}

export default new MovieController()