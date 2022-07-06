import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import MyTvShowEpisodeDAO from '../data/myTvShowEpisode/MyTvShowEpisodeDAO'
import MyTvShowEpisodeNeverWatchDAO from '../data/myTvShowEpisodeNeverWatch/MyTvShowEpisodeNeverWatchDAO'
import MyTvShowSeasonNeverWatchDAO from '../data/myTvShowSeasonNeverWatch/MyTvShowSeasonNeverWatchDAO'
import TvShowEpisodeDAO from '../data/tvShowEpisode/TvShowEpisodeDAO'
import TvShowSeasonDAO from '../data/tvShowSeason/TvShowSeasonDAO'
import { GetTvShowSeasonByJson } from '../domain/entity/tvShowSeason/TvShowSeasonConst'
import MyTvShowEpisodeController from './MyTvShowEpisodeController'
import MyTvShowEpisodeNeverWatchController from './MyTvShowEpisodeNeverWatchController'
import MyTvShowSeasonNeverWatchController from './MyTvShowSeasonNeverWatchController'
import TvShowEpisodeController from './TvShowEpisodeController'

class TvShowSeasonController {
    public async deleteSeasonAllByTvShowId(tvShowIds: string[]) {
        const tvShowSeasonDAO = new TvShowSeasonDAO()
        await tvShowSeasonDAO.findAllByTvShowIds(tvShowIds).then(async valueJson => {
            const idsDelete: string[] = []
            for (let v = 0; v < valueJson.length; v++) {
                idsDelete.push(valueJson[v]._id)
            }
            await MyTvShowEpisodeController.deleteAllByTvShowSeasonIds(idsDelete)
            await MyTvShowEpisodeNeverWatchController.deleteAllByTvShowSeasonIds(idsDelete)
            await MyTvShowSeasonNeverWatchController.deleteAllByTvShowSeasonIds(idsDelete)
            await TvShowEpisodeController.deleteAllByTvSeasonId(idsDelete)
            await tvShowSeasonDAO.deleteAllByIds(idsDelete)
        })
    }

    public openAllByNotMyTvShow(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowSeasonDAO = new TvShowSeasonDAO()
                const tvShowEpisodeDAO = new TvShowEpisodeDAO()
                const myTvShowSeasonNeverWatchDAO = new MyTvShowSeasonNeverWatchDAO()
                const myTvShowEpisodeNeverWatchDAO = new MyTvShowEpisodeNeverWatchDAO()
                const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()
                tvShowSeasonDAO.findAllByTvShowIdAndStatus(req.params.tvShowId, true).then(async valuesJson => {
                    let seasons = valuesJson.map(vj => GetTvShowSeasonByJson(vj, req.userAuth))
                    if (req.userAuth.level != "ADMIN") {
                        seasons = seasons.filter(season => season.reviewed || (season.user_register == req.userAuth._id))
                    }
                    const seasonsNew: object[] = []
                    for (let s = 0; s < seasons.length; s++) {
                        let statusSeason = true
                        let countEpisode = 0
                        let countWatch = 0
                        await tvShowEpisodeDAO.countAllByTvShowSeasonIdAndStatus(seasons[s]._id, true).then(countJson => {
                            countEpisode = countJson
                        })
                        await myTvShowEpisodeDAO.countAllByTvShowSeasonIdAndUserId(seasons[s]._id, req.userAuth._id).then(countJson => {
                            countWatch += countJson
                        })
                        await myTvShowEpisodeNeverWatchDAO.countAllByTvShowSeasonIdAndUserId(seasons[s]._id, req.userAuth._id).then(countJson => {
                            countWatch += countJson
                        })
                        if (countEpisode <= countWatch) {
                            statusSeason = false
                        }
                        await myTvShowSeasonNeverWatchDAO.findByTvShowSeasonIdAndUserId(seasons[s]._id, req.userAuth._id).then(mtssnw => {
                            if (mtssnw != null) {
                                statusSeason = false
                            }
                        })
                        if (statusSeason) {
                            seasonsNew.push(seasons[s])
                        }
                    }
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, seasonsNew))
                }).catch(err => console.log(err))
            }
        })
    }

    private static async deleteLocalSeasonByIds(idsSeason: string[], tvShowSeasonDAO: TvShowSeasonDAO) {
        await tvShowSeasonDAO.findAllByIds(idsSeason).then(async valueJson => {
            const idsDelete: string[] = []
            const idsUpdate: string[] = []
            for (let v = 0; v < valueJson.length; v++) {
                if (!valueJson[v].reviewed) {
                    idsDelete.push(valueJson[v]._id)
                } else {
                    idsUpdate.push(valueJson[v]._id)
                }
            }
            await MyTvShowEpisodeController.deleteAllByTvShowSeasonIds(idsDelete)
            await MyTvShowEpisodeNeverWatchController.deleteAllByTvShowSeasonIds(idsDelete)
            await MyTvShowSeasonNeverWatchController.deleteAllByTvShowSeasonIds(idsDelete)
            await TvShowEpisodeController.deleteAllByTvSeasonId(idsDelete)
            await tvShowSeasonDAO.deleteAllByIds(idsDelete)
            await tvShowSeasonDAO.updateByIds({ status: false, "updated_at": ConvertData.getDateNowStr() }, idsUpdate)
        })
    }

    public deleteById(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                let seasonIds: string[] = []
                if (typeof req.route.methods.put != "undefined" && req.route.methods.put) {
                    seasonIds = JSON.parse(req.body.tvShowSeasonId)
                } else {
                    seasonIds.push(req.params.tvShowSeasonId)
                }
                await TvShowSeasonController.deleteLocalSeasonByIds(seasonIds, (new TvShowSeasonDAO()))
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public updateApprovedById(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowSeasonDAO = new TvShowSeasonDAO()
                tvShowSeasonDAO.updateById({ reviewed: true, updated_at: ConvertData.getDateNowStr() },
                    req.params.tvShowSeasonId).then(async valueUpdate => {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                    }).catch(err => console.log(err))
            }
        })
    }

    public updateById(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowSeasonDAO = new TvShowSeasonDAO()
                tvShowSeasonDAO.updateById({ name: req.body.name, updated_at: ConvertData.getDateNowStr() },
                    req.params.tvShowSeasonId).then(valueUpdate => {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                    })
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
                const tvShowSeasonDAO = new TvShowSeasonDAO()
                tvShowSeasonDAO.find(req.params.tvShowSeasonId).then(async valueJson => {
                    const season = GetTvShowSeasonByJson(valueJson!!, req.userAuth)
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, season))
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
                const tvShowSeasonDAO = new TvShowSeasonDAO()
                const reviewed = req.userAuth.level == "ADMIN"
                tvShowSeasonDAO.create(req.body.name, req.params.tvShowId, req.userAuth._id, reviewed,
                    ConvertData.getDateNowStr()).then(async valueId => {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueId))
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
                const tvShowSeasonDAO = new TvShowSeasonDAO()
                tvShowSeasonDAO.findAllByTvShowIdAndStatus(req.params.tvShowId, true).then(async valuesJson => {
                    let seasons = valuesJson.map(vj => GetTvShowSeasonByJson(vj, req.userAuth))
                    if (req.userAuth.level != "ADMIN") {
                        seasons = seasons.filter(season => season.reviewed || (season.user_register == req.userAuth._id))
                    }
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, seasons))
                }).catch(err => console.log(err))
            }
        })
    }
}

export default new TvShowSeasonController()