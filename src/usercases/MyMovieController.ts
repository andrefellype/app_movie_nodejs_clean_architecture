import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import MovieDAO from '../data/movie/MovieDAO'
import DirectorDAO from '../data/director/DirectorDAO'
import ActorDAO from '../data/actor/ActorDAO'
import CategoryDAO from '../data/category/CategoryDAO'
import CountryDAO from '../data/country/CountryDAO'
import StreamDAO from '../data/stream/StreamDAO'
import MyMovieDAO from '../data/myMovie/MyMovieDAO'
import { MyMovieGetObjectForJson } from '../domain/entity/myMovie/MyMovieConst'
import MyMovieNeverWatchDAO from '../data/myMovieNeverWatch/MyMovieNeverWatchDAO'
import Category from '../domain/entity/category/Category'
import Director from '../domain/entity/director/Director'
import Actor from '../domain/entity/actor/Actor'
import Country from '../domain/entity/country/Country'
import Stream from '../domain/entity/stream/Stream'

class MyMovieController {
    public async deleteMyMovieAllByMovieId(idsMovie: object[]) {
        const myMovieNeverWatchDAO = new MyMovieNeverWatchDAO()
        const myMovieDAO = new MyMovieDAO()
        await myMovieNeverWatchDAO.deleteAll({ movie_id: { $in: idsMovie } })
        await myMovieDAO.deleteAll({ movie_id: { $in: idsMovie } })
    }

    private static async deleteMyMovie(movieId: string, userId: string, myMovieDAO: MyMovieDAO) {
        await myMovieDAO.deleteByMovieIdAndUserId(movieId, userId)
    }

    public delete(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const myMovieDAO = new MyMovieDAO()
                await MyMovieController.deleteMyMovie(req.body.movieId, req.userAuth._id, myMovieDAO)
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public createNeverWatch(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const myMovieNeverWatchDAO = new MyMovieNeverWatchDAO()
                myMovieNeverWatchDAO.openByMovieIdAndUserId(req.body.movieId, req.userAuth._id).then(valueNever => {
                    if (valueNever == null) {
                        myMovieNeverWatchDAO.create(req.userAuth._id, req.body.movieId, ConvertData.getDateNowStr()).then(async valueId => {
                            DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueId))
                        }).catch(err => console.log(err))
                    } else {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                    }
                })
            }
        })
    }

    public create(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const myMovieDAO = new MyMovieDAO()
                myMovieDAO.openByMovieIdAndUserId(req.body.movieId, req.userAuth._id).then(valueMy => {
                    if (valueMy == null) {
                        myMovieDAO.create(req.userAuth._id, req.body.movieId, ConvertData.getDateNowStr()).then(async valueId => {
                            DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueId))
                        }).catch(err => console.log(err))
                    } else {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                    }
                })
            }
        })
    }

    public getAll(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const myMovieDAO = new MyMovieDAO()
                const movieDAO = new MovieDAO()
                myMovieDAO.getAllByUserId(req.userAuth._id).then(async valuesJson => {
                    const myMovies = valuesJson.map(vj => MyMovieGetObjectForJson(vj))
                    for (let m = 0; m < myMovies.length; m++) {
                        await movieDAO.open(myMovies[m].movie_id).then(async movieJson => {
                            if (movieJson != null) {
                                await MyMovieController.getAllDetailsMovie(req, movieJson).then(valueMovie => {
                                    myMovies[m].movie = valueMovie
                                })
                            }
                        })
                    }
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, myMovies))
                }).catch(err => console.log(err))
            }
        })
    }

    private static async getAllDetailsMovie(req, movie) {
        const directorDAO = new DirectorDAO()
        const actorDAO = new ActorDAO()
        const categoryDAO = new CategoryDAO()
        const countryDAO = new CountryDAO()
        const streamDAO = new StreamDAO()

        const movieCategories: Category[] = []
        if (req.body.object == null || req.body.object.category) {
            for (let mca = 0; mca < movie.categories_id.length; mca++) {
                await categoryDAO.open(movie.categories_id[mca]).then(valueJsonCategory => {
                    if (valueJsonCategory!!.status) {
                        movieCategories.push(valueJsonCategory!!)
                    }
                })
            }
        }
        movie.categories = movieCategories

        const movieDirectors: Director[] = []
        if (req.body.object == null || req.body.object.director) {
            for (let md = 0; md < movie.directors_id.length; md++) {
                await directorDAO.open(movie.directors_id[md]).then(valueJsonDirector => {
                    if (valueJsonDirector!!.status) {
                        movieDirectors.push(valueJsonDirector!!)
                    }
                })
            }
        }
        movie.directors = movieDirectors

        const movieCasts: Actor[] = []
        if (req.body.object == null || req.body.object.cast) {
            for (let mc = 0; mc < movie.casts_id.length; mc++) {
                await actorDAO.open(movie.casts_id[mc]).then(valueJsonActor => {
                    if (valueJsonActor!!.status) {
                        movieCasts.push(valueJsonActor!!)
                    }
                })
            }
        }
        movie.casts = movieCasts

        const movieCountries: Country[] = []
        if (req.body.object == null || req.body.object.country) {
            for (let mco = 0; mco < movie.countries_id.length; mco++) {
                await countryDAO.open(movie.countries_id[mco]).then(valueJsonCountry => {
                    if (valueJsonCountry!!.status) {
                        movieCountries.push(valueJsonCountry!!)
                    }
                })
            }
        }
        movie.countries = movieCountries

        const movieStreams: Stream[] = []
        if (req.body.object == null || req.body.object.stream) {
            for (let ms = 0; ms < movie.streams_id.length; ms++) {
                await streamDAO.open(movie.streams_id[ms]).then(valueJsonStream => {
                    if (valueJsonStream!!.status) {
                        movieStreams.push(valueJsonStream!!)
                    }
                })
            }
        }
        movie.streams = movieStreams

        return movie
    }
}

export default new MyMovieController()