import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import TvShowEpisodeDAO from '../data/tvShowEpisode/TvShowEpisodeDAO'
import ConvertData from '../app/core/ConvertData'
import { GetTvShowEpisodeByJson } from '../domain/entity/tvShowEpisode/TvShowEpisodeConst'
import TvShowSeasonDAO from '../data/tvShowSeason/TvShowSeasonDAO'
import MyTvShowEpisodeNeverWatchDAO from '../data/myTvShowEpisodeNeverWatch/MyTvShowEpisodeNeverWatchDAO'
import MyTvShowEpisodeDAO from '../data/myTvShowEpisode/MyTvShowEpisodeDAO'
import MyTvShowEpisodeController from './MyTvShowEpisodeController'
import MyTvShowEpisodeNeverWatchController from './MyTvShowEpisodeNeverWatchController'

class TvShowEpisodeController {
    public async deleteAllByTvShowId(tvShowIds: string[]) {
        const tvShowSeasonDAO = new TvShowSeasonDAO()
        const tvShowEpisodeDAO = new TvShowEpisodeDAO()
        await tvShowSeasonDAO.findAllByTvShowIds(tvShowIds).then(async seasonsJson => {
            const tvShowSeasonIds = seasonsJson.map(s => s._id)
            await tvShowEpisodeDAO.findAllByTvShowSeasonIds(tvShowSeasonIds).then(async valueJson => {
                const idsDelete: string[] = []
                for (let v = 0; v < valueJson.length; v++) {
                    idsDelete.push(valueJson[v]._id)
                }
                await MyTvShowEpisodeController.deleteAllByTvShowEpisodeIds(idsDelete)
                await MyTvShowEpisodeNeverWatchController.deleteAllByTvShowEpisodeIds(idsDelete)
                await tvShowEpisodeDAO.deleteAllByIds(idsDelete)
            })
        })
    }

    public async deleteAllByTvSeasonId(tvShowSeasonIds: string[]) {
        const tvShowEpisodeDAO = new TvShowEpisodeDAO()
        await tvShowEpisodeDAO.findAllByTvShowSeasonIds(tvShowSeasonIds).then(async valueJson => {
            const idsDelete: string[] = []
            for (let v = 0; v < valueJson.length; v++) {
                idsDelete.push(valueJson[v]._id)
            }
            await MyTvShowEpisodeController.deleteAllByTvShowEpisodeIds(idsDelete)
            await MyTvShowEpisodeNeverWatchController.deleteAllByTvShowEpisodeIds(idsDelete)
            await tvShowEpisodeDAO.deleteAllByIds(idsDelete)
        })
    }

    public openAllByNotMyTvShow(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowEpisodeDAO = new TvShowEpisodeDAO()
                const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()
                const myTvShowEpisodeNeverWatchDAO = new MyTvShowEpisodeNeverWatchDAO()
                tvShowEpisodeDAO.findAllByTvShowSeasonIdAndStatus(req.params.tvShowSeasonId, true).then(async valuesJson => {
                    let episodes = valuesJson.map(vj => GetTvShowEpisodeByJson(vj, req.userAuth))
                    if (req.userAuth.level != "ADMIN") {
                        episodes = episodes.filter(season => season.reviewed || (season.user_register == req.userAuth._id))
                    }
                    const episodesNew: object[] = []
                    for (let e = 0; e < episodes.length; e++) {
                        let statusEpisode = true
                        await myTvShowEpisodeDAO.findByTvShowEpisodeIdAndUserId(episodes[e]._id, req.userAuth._id).then(mtse => {
                            if (mtse != null) {
                                statusEpisode = false
                            }
                        })
                        await myTvShowEpisodeNeverWatchDAO.findByTvShowEpisodeIdAndUserId(episodes[e]._id, req.userAuth._id).then(mtsenw => {
                            if (mtsenw != null) {
                                statusEpisode = false
                            }
                        })
                        if (statusEpisode) {
                            episodesNew.push(episodes[e])
                        }
                    }
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, episodesNew))
                }).catch(err => console.log(err))
            }
        })
    }

    private static async deleteLocalByIds(tvShowEpisodeIds: string[], tvShowEpisodeDAO: TvShowEpisodeDAO) {
        await tvShowEpisodeDAO.findAllByIds(tvShowEpisodeIds).then(async valueJson => {
            const idsDelete: string[] = []
            const idsUpdate: string[] = []
            for (let v = 0; v < valueJson.length; v++) {
                if (!valueJson[v].reviewed) {
                    idsDelete.push(valueJson[v]._id)
                } else {
                    idsUpdate.push(valueJson[v]._id)
                }
            }
            await MyTvShowEpisodeController.deleteAllByTvShowEpisodeIds(idsDelete)
            await MyTvShowEpisodeNeverWatchController.deleteAllByTvShowEpisodeIds(idsDelete)
            await tvShowEpisodeDAO.deleteAllByIds(idsDelete)
            await tvShowEpisodeDAO.updateByIds({ status: false, "updated_at": ConvertData.getDateNowStr() }, idsUpdate)
        })
    }

    public deleteById(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                let tvShowEpisodeIds: string[] = []
                if (typeof req.route.methods.put != "undefined" && req.route.methods.put) {
                    tvShowEpisodeIds = JSON.parse(req.body.tvShowEpisodeId)
                } else {
                    tvShowEpisodeIds.push(req.params.tvShowEpisodeId)
                }
                await TvShowEpisodeController.deleteLocalByIds(tvShowEpisodeIds, (new TvShowEpisodeDAO()))
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
                const tvShowEpisodeDAO = new TvShowEpisodeDAO()
                tvShowEpisodeDAO.updateById({ reviewed: true, updated_at: ConvertData.getDateNowStr() },
                    req.params.tvShowEpisodeId).then(valueUpdate => {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                    })
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
                const tvShowEpisodeDAO = new TvShowEpisodeDAO()
                tvShowEpisodeDAO.updateById({ name: req.body.name, updated_at: ConvertData.getDateNowStr() },
                    req.params.tvShowEpisodeId).then(valueUpdate => {
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
                const tvShowEpisodeDAO = new TvShowEpisodeDAO()
                tvShowEpisodeDAO.find(req.params.tvShowEpisodeId).then(async valueJson => {
                    const episode = GetTvShowEpisodeByJson(valueJson!!, req.userAuth)
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, episode))
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
                const tvShowEpisodeDAO = new TvShowEpisodeDAO()
                const reviewed = req.userAuth.level == "ADMIN"
                tvShowEpisodeDAO.create(req.body.name, req.params.tvShowSeasonId, req.userAuth._id, reviewed,
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
                const tvShowEpisodeDAO = new TvShowEpisodeDAO()
                tvShowEpisodeDAO.findAllByTvShowSeasonIdAndStatus(req.params.tvShowSeasonId, true).then(async valuesJson => {
                    let episodes = valuesJson.map(vj => GetTvShowEpisodeByJson(vj, req.userAuth))
                    if (req.userAuth.level != "ADMIN") {
                        episodes = episodes.filter(season => season.reviewed || (season.user_register == req.userAuth._id))
                    }
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, episodes))
                }).catch(err => console.log(err))
            }
        })
    }
}

export default new TvShowEpisodeController()