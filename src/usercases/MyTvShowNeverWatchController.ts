import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import MyTvShowNeverWatchDAO from '../data/myTvShowNeverWatch/MyTvShowNeverWatchDAO'

class MyTvShowNeverWatchController {
    public async deleteAllByTvShowIds(idsTvShow: string[]) {
        const myTvShowENeverWatchDAO = new MyTvShowNeverWatchDAO()
        await myTvShowENeverWatchDAO.deleteAllByTvShowIds(idsTvShow)
    }

    public create(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const myTvShowNeverWatchDAO = new MyTvShowNeverWatchDAO()
                myTvShowNeverWatchDAO.findByTvShowIdAndUserId(req.params.tvShowId, req.userAuth._id).then(valueNever => {
                    if (valueNever == null) {
                        myTvShowNeverWatchDAO.create(req.userAuth._id, req.params.tvShowId, ConvertData.getDateNowStr()).then(async valueId => {
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

export default new MyTvShowNeverWatchController()