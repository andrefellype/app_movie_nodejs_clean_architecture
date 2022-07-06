import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import MyTvShowEpisodeDAO from '../data/myTvShowEpisode/MyTvShowEpisodeDAO'
import TvShowDAO from '../data/tvShow/TvShowDAO'
import TvShowSeasonDAO from '../data/tvShowSeason/TvShowSeasonDAO'
import TvShowEpisodeDAO from '../data/tvShowEpisode/TvShowEpisodeDAO'
import { GetTvShowByJson } from '../domain/entity/tvShow/TvShowConst'
import TvShow from '../domain/entity/tvShow/TvShow'

class MyTvShowEpisodeController {
    public async deleteAllByTvShowIds(idsTvShow: string[]) {
        const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()
        await myTvShowEpisodeDAO.deleteAllByTvShowIds(idsTvShow)
    }

    public async deleteAllByTvShowSeasonIds(idsTvShowSeason: string[]) {
        const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()
        await myTvShowEpisodeDAO.deleteAllByTvShowSeasonsIds(idsTvShowSeason)
    }

    public async deleteAllByTvShowEpisodeIds(idsTvShowEpisode: string[]) {
        const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()
        await myTvShowEpisodeDAO.deleteAllByTvShowEpisodeIds(idsTvShowEpisode)
    }

    private static async deleteAllByTvShowIdAndUserId(tvShowId: string, userId: string, myTvShowEpisodeDAO: MyTvShowEpisodeDAO) {
        await myTvShowEpisodeDAO.deleteAllByTvShowIdAndUserIds(tvShowId, userId)
    }

    public deleteById(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()
                await MyTvShowEpisodeController.deleteAllByTvShowIdAndUserId(req.params.tvShowId, req.userAuth._id, myTvShowEpisodeDAO)
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
                const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()
                const episodes = req.body.episodes
                for (let e = 0; e < episodes.length; e++) {
                    await myTvShowEpisodeDAO.findByTvShowEpisodeIdAndUserId(episodes[e]._id, req.userAuth._id).then(async valueMy => {
                        if (valueMy == null) {
                            await myTvShowEpisodeDAO.create(req.userAuth._id, req.params.tvShowId,
                                req.params.tvShowSeasonId, episodes[e]._id, ConvertData.getDateNowStr())
                        }
                    })
                }
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public openAll(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()
                const tvShowDAO = new TvShowDAO()
                const tvShowSeasonDAO = new TvShowSeasonDAO()
                const tvShowEpisodeDAO = new TvShowEpisodeDAO()
                myTvShowEpisodeDAO.findAllByUserId(req.userAuth._id).then(async valuesJson => {
                    let tvShows: { tvShow: TvShow, countEpisodeWatch: number, percentage: number }[] = []
                    for (let v = 0; v < valuesJson.length; v++) {
                        let posInsert = -1
                        for (let t = 0; t < tvShows.length; t++) {
                            if (tvShows[t].tvShow._id.toString() == valuesJson[v].tv_show_id.toString()) {
                                posInsert = t
                            }
                        }
                        if (posInsert == -1) {
                            await tvShowDAO.find(valuesJson[v].tv_show_id).then(async valueTvShowJson => {
                                let tvShowValue = GetTvShowByJson(valueTvShowJson!!, req.userAuth)
                                await MyTvShowEpisodeController.openAllDetailsTvShow(tvShowValue).then(tsj => {
                                    tvShowValue = tsj
                                })
                                tvShows.push({ tvShow: tvShowValue, countEpisodeWatch: 1, percentage: 0 })
                            })
                        } else {
                            tvShows[posInsert].countEpisodeWatch = tvShows[posInsert].countEpisodeWatch + 1
                        }
                    }
                    const tvShowsNew: { tvShow: TvShow, countEpisodeWatch: number, percentage: number }[] = []
                    for (let ts = 0; ts < tvShows.length; ts++) {
                        let countEpisode = 0
                        await tvShowSeasonDAO.findAllByTvShowIdAndStatus(tvShows[ts].tvShow._id, true).then(async valueSeasonsJson => {
                            for (let s = 0; s < valueSeasonsJson.length; s++) {
                                await tvShowEpisodeDAO.countAllByTvShowSeasonIdAndStatus(valueSeasonsJson[s]._id, true).then(countEpisodeJson => {
                                    countEpisode += countEpisodeJson
                                })
                            }
                        })
                        const percentageStr = (countEpisode > 0 ? (100 * tvShows[ts].countEpisodeWatch) / countEpisode : 0).toFixed(2)
                        tvShows[ts].percentage = parseFloat(percentageStr)
                        tvShowsNew.push(tvShows[ts])
                    }
                    tvShows = tvShowsNew
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, tvShows))
                }).catch(err => console.log(err))
            }
        })
    }

    private static async openAllDetailsTvShow(tvShow) {
        tvShow.categories = []
        tvShow.countries = []
        tvShow.streams = []
        return tvShow
    }
}

export default new MyTvShowEpisodeController()