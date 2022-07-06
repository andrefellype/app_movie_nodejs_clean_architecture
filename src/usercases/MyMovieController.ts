import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import MovieDAO from '../data/movie/MovieDAO'
import MyMovieDAO from '../data/myMovie/MyMovieDAO'
import { GetMyMovieByJson } from '../domain/entity/myMovie/MyMovieConst'

class MyMovieController {
    public async deleteAllByMovieIds(idsMovie: string[]) {
        const myMovieDAO = new MyMovieDAO()
        await myMovieDAO.deleteAllByMovieIds(idsMovie)
    }

    private static async deleteAllLocalByMovieByIdAndUserId(movieId: string, userId: string, myMovieDAO: MyMovieDAO) {
        await myMovieDAO.deleteAllByMovieIdAndUserId(movieId, userId)
    }

    public deleteById(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const myMovieDAO = new MyMovieDAO()
                await MyMovieController.deleteAllLocalByMovieByIdAndUserId(req.params.movieId, req.userAuth._id, myMovieDAO)
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
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
                const myMovieDAO = new MyMovieDAO()
                myMovieDAO.findByMovieIdAndUserId(req.params.movieId, req.userAuth._id).then(valueMy => {
                    if (valueMy == null) {
                        myMovieDAO.create(req.userAuth._id, req.params.movieId, ConvertData.getDateNowStr()).then(async valueId => {
                            DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueId))
                        }).catch(err => console.log(err))
                    } else {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                    }
                })
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
                const myMovieDAO = new MyMovieDAO()
                const movieDAO = new MovieDAO()
                myMovieDAO.findAllByUserId(req.userAuth._id).then(async valuesJson => {
                    const myMovies = valuesJson.map(vj => GetMyMovieByJson(vj))
                    for (let m = 0; m < myMovies.length; m++) {
                        await movieDAO.find(myMovies[m].movie_id).then(async movieJson => {
                            if (typeof movieJson !== "undefined" && movieJson != null) {
                                await MyMovieController.openAllDetailsMovie(movieJson).then(valueMovie => {
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

    private static async openAllDetailsMovie(movie) {
        movie.categories = []
        movie.directors = []
        movie.casts = []
        movie.countries = []
        movie.streams = []
        return movie
    }
}

export default new MyMovieController()