import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import MyTvShowEpisodeNeverWatchDAO from '../data/myTvShowEpisodeNeverWatch/MyTvShowEpisodeNeverWatchDAO'

class MyTvShowEpisodeNeverWatchController {
    public async deleteAllByTvShowIds(idsTvShow: string[]) {
        const myTvShowEpisodeNeverWatchDAO = new MyTvShowEpisodeNeverWatchDAO()
        await myTvShowEpisodeNeverWatchDAO.deleteAllByTvShowIds(idsTvShow)
    }

    public async deleteAllByTvShowSeasonIds(idsTvShowSeason: string[]) {
        const myTvShowEpisodeNeverWatchDAO = new MyTvShowEpisodeNeverWatchDAO()
        await myTvShowEpisodeNeverWatchDAO.deleteAllByTvShowSeasonsIds(idsTvShowSeason)
    }

    public async deleteAllByTvShowEpisodeIds(idsTvShowEpisode: string[]) {
        const myTvShowEpisodeNeverWatchDAO = new MyTvShowEpisodeNeverWatchDAO()
        await myTvShowEpisodeNeverWatchDAO.deleteAllByTvShowEpisodeIds(idsTvShowEpisode)
    }

    public create(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const myTvShowEpisodeNeverWatchDAO = new MyTvShowEpisodeNeverWatchDAO()
                myTvShowEpisodeNeverWatchDAO.findByTvShowEpisodeIdAndUserId(req.params.tvShowEpisodeId, req.userAuth._id).then(valueNever => {
                    if (valueNever == null) {
                        myTvShowEpisodeNeverWatchDAO.create(req.userAuth._id, req.params.tvShowEpisodeId,
                            req.params.tvShowSeasonId, req.params.tvShowId, ConvertData.getDateNowStr()).then(async valueId => {
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

export default new MyTvShowEpisodeNeverWatchController()