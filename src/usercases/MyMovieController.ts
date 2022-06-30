import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import MovieDAO from '../data/movie/MovieDAO'
import MyMovieDAO from '../data/myMovie/MyMovieDAO'
import { MyMovieGetObjectForJson } from '../domain/entity/myMovie/MyMovieConst'
import MyMovieNeverWatchDAO from '../data/myMovieNeverWatch/MyMovieNeverWatchDAO'

class MyMovieController {
    public async deleteMyMovieAllByMovieId(idsMovie: string[]) {
        const myMovieNeverWatchDAO = new MyMovieNeverWatchDAO()
        const myMovieDAO = new MyMovieDAO()
        await myMovieNeverWatchDAO.deleteAllByMovieIds(idsMovie)
        await myMovieDAO.deleteAllByMovieIds(idsMovie)
    }

    private static async deleteMyMovieById(movieId: string, userId: string, myMovieDAO: MyMovieDAO) {
        await myMovieDAO.deleteByMovieIdAndUserId(movieId, userId)
    }

    public deleteById(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const myMovieDAO = new MyMovieDAO()
                await MyMovieController.deleteMyMovieById(req.body.movieId, req.userAuth._id, myMovieDAO)
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
                        await movieDAO.openById(myMovies[m].movie_id).then(async movieJson => {
                            if (typeof movieJson !== "undefined" && movieJson != null) {
                                await MyMovieController.getAllDetailsMovie(movieJson).then(valueMovie => {
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

    private static async getAllDetailsMovie(movie) {
        movie.categories = []
        movie.directors = []
        movie.casts = []
        movie.countries = []
        movie.streams = []
        return movie
    }
}

export default new MyMovieController()