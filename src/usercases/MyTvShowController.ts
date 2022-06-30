import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import MyTvShowEpisodeDAO from '../data/myTvShowEpisode/MyTvShowEpisodeDAO'
import TvShowDAO from '../data/tvShow/TvShowDAO'
import TvShowSeasonDAO from '../data/tvShowSeason/TvShowSeasonDAO'
import TvShowEpisodeDAO from '../data/tvShowEpisode/TvShowEpisodeDAO'
import MyTvShowEpisodeNeverWatchDAO from '../data/myTvShowEpisodeNeverWatch/MyTvShowEpisodeNeverWatchDAO'
import MyTvShowSeasonNeverWatchDAO from '../data/myTvShowSeasonNeverWatch/MyTvShowSeasonNeverWatchDAO'
import MyTvShowNeverWatchDAO from '../data/myTvShowNeverWatch/MyTvShowNeverWatchDAO'
import { TvShowGetObjectForJson } from '../domain/entity/tvShow/TvShowConst'
import TvShow from '../domain/entity/tvShow/TvShow'

class MyTvShowController {
    public async deleteMyTvShowAllByTvShowId(idsTvShow: string[]) {
        const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()
        const myTvShowENeverWatchDAO = new MyTvShowNeverWatchDAO()
        const myTvShowESeasonNeverWatchDAO = new MyTvShowSeasonNeverWatchDAO()
        const myTvShowEpisodeNeverWatchDAO = new MyTvShowEpisodeNeverWatchDAO()
        await myTvShowEpisodeDAO.deleteAllByTvShowIds(idsTvShow)
        await myTvShowENeverWatchDAO.deleteAllByTvShowIds(idsTvShow)
        await myTvShowESeasonNeverWatchDAO.deleteAllByTvShowIds(idsTvShow)
        await myTvShowEpisodeNeverWatchDAO.deleteAllByTvShowIds(idsTvShow)
    }

    public async deleteMyTvShowSeasonAllByTvShowSeasonId(idsTvShowSeason: string[]) {
        const myTvShowSeasonNeverWatchDAO = new MyTvShowSeasonNeverWatchDAO()
        await myTvShowSeasonNeverWatchDAO.deleteAllByTvShowSeasonIds(idsTvShowSeason)
    }

    public async deleteMyTvShowEpisodeAllByTvShowSeasonId(idsTvShowSeason: string[]) {
        const myTvShowEpisodeNeverWatchDAO = new MyTvShowEpisodeNeverWatchDAO()
        const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()
        await myTvShowEpisodeNeverWatchDAO.deleteAllByTvShowSeasonsIds(idsTvShowSeason)
        await myTvShowEpisodeDAO.deleteAllByTvShowSeasonsIds(idsTvShowSeason)
    }

    public async deleteMyTvShowEpisodeAllByTvShowEpisodeId(idsTvShowEpisode: string[]) {
        const myTvShowEpisodeNeverWatchDAO = new MyTvShowEpisodeNeverWatchDAO()
        const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()
        await myTvShowEpisodeNeverWatchDAO.deleteAllByTvShowEpisodeIds(idsTvShowEpisode)
        await myTvShowEpisodeDAO.deleteAllByTvShowEpisodeIds(idsTvShowEpisode)
    }

    private static async deleteMyTvShow(tvShowId: string, userId: string, myTvShowEpisodeDAO: MyTvShowEpisodeDAO) {
        await myTvShowEpisodeDAO.deleteByTvShowIdAndUserIds(tvShowId, userId)
    }

    public delete(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()
                await MyTvShowController.deleteMyTvShow(req.body.tvShowId, req.userAuth._id, myTvShowEpisodeDAO)
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
                if (req.body.typeRegister == "tvShow") {
                    const myTvShowNeverWatchDAO = new MyTvShowNeverWatchDAO()
                    myTvShowNeverWatchDAO.openByTvShowIdAndUserId(req.body.tvShowId, req.userAuth._id).then(valueNever => {
                        if (valueNever == null) {
                            myTvShowNeverWatchDAO.create(req.userAuth._id, req.body.tvShowId, ConvertData.getDateNowStr()).then(async valueId => {
                                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueId))
                            }).catch(err => console.log(err))
                        } else {
                            DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                        }
                    })
                } else if (req.body.typeRegister == "season") {
                    const myTvShowSeasonNeverWatchDAO = new MyTvShowSeasonNeverWatchDAO()
                    myTvShowSeasonNeverWatchDAO.openByTvShowSeasonIdAndUserId(req.body.tvShowSeasonId, req.userAuth._id).then(valueNever => {
                        if (valueNever == null) {
                            myTvShowSeasonNeverWatchDAO.create(req.userAuth._id, req.body.tvShowSeasonId, req.body.tvShowId, ConvertData.getDateNowStr()).then(async valueId => {
                                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueId))
                            }).catch(err => console.log(err))
                        } else {
                            DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                        }
                    })
                } else if (req.body.typeRegister == "episode") {
                    const myTvShowEpisodeNeverWatchDAO = new MyTvShowEpisodeNeverWatchDAO()
                    myTvShowEpisodeNeverWatchDAO.openByTvShowEpisodeIdAndUserId(req.body.tvShowEpisodeId, req.userAuth._id).then(valueNever => {
                        if (valueNever == null) {
                            myTvShowEpisodeNeverWatchDAO.create(req.userAuth._id, req.body.tvShowEpisodeId, req.body.tvShowSeasonId, req.body.tvShowId, ConvertData.getDateNowStr()).then(async valueId => {
                                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueId))
                            }).catch(err => console.log(err))
                        } else {
                            DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                        }
                    })
                } else {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, [{ msg: "Tipo de registro inválido." }]))
                }
            }
        })
    }

    public create(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()
                const episodes = req.body.episodes
                for (let e = 0; e < episodes.length; e++) {
                    await myTvShowEpisodeDAO.openByTvShowEpisodeIdAndUserId(episodes[e]._id, req.userAuth._id).then(async valueMy => {
                        if (valueMy == null) {
                            await myTvShowEpisodeDAO.create(req.userAuth._id, req.body.tvShowId, req.body.tvShowSeasonId, episodes[e]._id, ConvertData.getDateNowStr())
                        }
                    })
                }
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public getAll(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()
                const tvShowDAO = new TvShowDAO()
                const tvShowSeasonDAO = new TvShowSeasonDAO()
                const tvShowEpisodeDAO = new TvShowEpisodeDAO()
                myTvShowEpisodeDAO.getAllByUserId(req.userAuth._id).then(async valuesJson => {
                    let tvShows: { tvShow: TvShow, countEpisodeWatch: number, percentage: number }[] = []
                    for (let v = 0; v < valuesJson.length; v++) {
                        let posInsert = -1
                        for (let t = 0; t < tvShows.length; t++) {
                            if (tvShows[t].tvShow._id.toString() == valuesJson[v].tv_show_id.toString()) {
                                posInsert = t
                            }
                        }
                        if (posInsert == -1) {
                            await tvShowDAO.openById(valuesJson[v].tv_show_id).then(async valueTvShowJson => {
                                let tvShowValue = TvShowGetObjectForJson(valueTvShowJson!!, req.userAuth)
                                await MyTvShowController.getAllDetailsTvShow(tvShowValue).then(tsj => {
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
                        await tvShowSeasonDAO.getAllByTvShowIdAndStatus(tvShows[ts].tvShow._id, true).then(async valueSeasonsJson => {
                            for (let s = 0; s < valueSeasonsJson.length; s++) {
                                await tvShowEpisodeDAO.countByTvShowSeasonIdAndStatus(valueSeasonsJson[s]._id, true).then(countEpisodeJson => {
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

    private static async getAllDetailsTvShow(tvShow) {
        tvShow.categories = []
        tvShow.countries = []
        tvShow.streams = []
        return tvShow
    }
}

export default new MyTvShowController()