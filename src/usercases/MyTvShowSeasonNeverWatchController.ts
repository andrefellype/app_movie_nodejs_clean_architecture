import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import MyTvShowSeasonNeverWatchDAO from '../data/myTvShowSeasonNeverWatch/MyTvShowSeasonNeverWatchDAO'

class MyTvShowSeasonNeverWatchController {
    public async deleteAllByTvShowIds(idsTvShow: string[]) {
        const myTvShowESeasonNeverWatchDAO = new MyTvShowSeasonNeverWatchDAO()
        await myTvShowESeasonNeverWatchDAO.deleteAllByTvShowIds(idsTvShow)
    }

    public async deleteAllByTvShowSeasonIds(idsTvShowSeason: string[]) {
        const myTvShowSeasonNeverWatchDAO = new MyTvShowSeasonNeverWatchDAO()
        await myTvShowSeasonNeverWatchDAO.deleteAllByTvShowSeasonIds(idsTvShowSeason)
    }

    public create(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const myTvShowSeasonNeverWatchDAO = new MyTvShowSeasonNeverWatchDAO()
                myTvShowSeasonNeverWatchDAO.findByTvShowSeasonIdAndUserId(req.params.tvShowSeasonId, req.userAuth._id).then(valueNever => {
                    if (valueNever == null) {
                        myTvShowSeasonNeverWatchDAO.create(req.userAuth._id, req.params.tvShowSeasonId, req.params.tvShowId,
                            ConvertData.getDateNowStr()).then(async valueId => {
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

export default new MyTvShowSeasonNeverWatchController()