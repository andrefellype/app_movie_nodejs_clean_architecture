import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import MyMovieNeverWatchDAO from '../data/myMovieNeverWatch/MyMovieNeverWatchDAO'

class MyMovieNeverWatchController {
    public async deleteAllByMovieIds(idsMovie: string[]) {
        const myMovieNeverWatchDAO = new MyMovieNeverWatchDAO()
        await myMovieNeverWatchDAO.deleteAllByMovieIds(idsMovie)
    }

    public create(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const myMovieNeverWatchDAO = new MyMovieNeverWatchDAO()
                myMovieNeverWatchDAO.findByMovieIdAndUserId(req.params.movieId, req.userAuth._id).then(valueNever => {
                    if (valueNever == null) {
                        myMovieNeverWatchDAO.create(req.userAuth._id, req.params.movieId, ConvertData.getDateNowStr()).then(async valueId => {
                            DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueId))
                        }).catch(err => console.log(err))
                    } else {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                    }
                })
            }
        })
    }
}

export default new MyMovieNeverWatchController()