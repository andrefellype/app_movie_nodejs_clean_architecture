import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import { ObjectId } from 'mongodb'
import TvShowEpisodeDAO from '../data/tvShowEpisode/TvShowEpisodeDAO'
import ConvertData from '../app/core/ConvertData'
import { TvShowEpisodeGetObjectForJson } from '../domain/entity/tvShowEpisode/TvShowEpisodeConst'
import MyTvShowEpisodeDAO from '../data/myTvShowEpisode/MyTvShowEpisodeDAO'
import MyTvShowEpisodeNeverWatchDAO from '../data/myTvShowEpisodeNeverWatch/MyTvShowEpisodeNeverWatchDAO'
import MyTvShowController from './MyTvShowController'
import TvShowSeasonDAO from '../data/tvShowSeason/TvShowSeasonDAO'

class TvShowEpisodeController {
    public async deleteEpisodeAllByTvShowId(tvShowIds: string[]) {
        const tvShowSeasonDAO = new TvShowSeasonDAO()
        const tvShowEpisodeDAO = new TvShowEpisodeDAO()
        await tvShowSeasonDAO.getAllByTvShowIds(tvShowIds).then(async seasonsJson => {
            const tvShowSeasonIds = seasonsJson.map(s => s._id)
            await tvShowEpisodeDAO.getAllByTvShowSeasonIds(tvShowSeasonIds).then(async valueJson => {
                const idsDelete: string[] = []
                for (let v = 0; v < valueJson.length; v++) {
                    idsDelete.push(valueJson[v]._id)
                }
                await MyTvShowController.deleteMyTvShowEpisodeAllByTvShowEpisodeId(idsDelete)
                await tvShowEpisodeDAO.deleteAllByIds(idsDelete)
            })
        })
    }

    public async deleteEpisodeAllByTvSeasonId(tvShowSeasonIds: string[]) {
        const tvShowEpisodeDAO = new TvShowEpisodeDAO()
        await tvShowEpisodeDAO.getAllByTvShowSeasonIds(tvShowSeasonIds).then(async valueJson => {
            const idsDelete: string[] = []
            for (let v = 0; v < valueJson.length; v++) {
                idsDelete.push(valueJson[v]._id)
            }
            await MyTvShowController.deleteMyTvShowEpisodeAllByTvShowEpisodeId(idsDelete)
        })
        const _ids = tvShowSeasonIds
        await tvShowEpisodeDAO.deleteAllByIds(_ids)
    }

    public getAllByNotMyTvShow(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowEpisodeDAO = new TvShowEpisodeDAO()
                const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()
                const myTvShowEpisodeNeverWatchDAO = new MyTvShowEpisodeNeverWatchDAO()
                tvShowEpisodeDAO.getAllByTvShowSeasonIdAndStatus(req.body.tvShowSeasonId, true).then(async valuesJson => {
                    let episodes = valuesJson.map(vj => TvShowEpisodeGetObjectForJson(vj, req.userAuth))
                    if (req.userAuth.level != "ADMIN") {
                        episodes = episodes.filter(season => season.reviewed || (season.user_register == req.userAuth._id))
                    }
                    const episodesNew: object[] = []
                    for (let e = 0; e < episodes.length; e++) {
                        let statusEpisode = true
                        await myTvShowEpisodeDAO.openByTvShowEpisodeIdAndUserId(episodes[e]._id, req.userAuth._id).then(mtse => {
                            if (mtse != null) {
                                statusEpisode = false
                            }
                        })
                        await myTvShowEpisodeNeverWatchDAO.openByTvShowEpisodeIdAndUserId(episodes[e]._id, req.userAuth._id).then(mtsenw => {
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

    private static async deleteEpisodeByIds(tvShowEpisodeIds: string[], tvShowEpisodeDAO: TvShowEpisodeDAO) {
        await tvShowEpisodeDAO.getAllByIds(tvShowEpisodeIds).then(async valueJson => {
            const idsDelete: string[] = []
            const idsUpdate: string[] = []
            for (let v = 0; v < valueJson.length; v++) {
                if (!valueJson[v].reviewed) {
                    idsDelete.push(valueJson[v]._id)
                } else {
                    idsUpdate.push(valueJson[v]._id)
                }
            }
            await MyTvShowController.deleteMyTvShowEpisodeAllByTvShowEpisodeId(idsDelete)
            await tvShowEpisodeDAO.deleteAllByIds(idsDelete)
            await tvShowEpisodeDAO.updateByIds({ status: false, "updated_at": ConvertData.getDateNowStr() }, idsUpdate)
        })
    }

    public deleteSeveralByIds(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                await TvShowEpisodeController.deleteEpisodeByIds(JSON.parse(req.body._ids), (new TvShowEpisodeDAO()))
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public deleteById(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                await TvShowEpisodeController.deleteEpisodeByIds([req.body.tvShowEpisodeId], (new TvShowEpisodeDAO()))
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public updateApprovedById(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowEpisodeDAO = new TvShowEpisodeDAO()
                tvShowEpisodeDAO.updateById({ reviewed: true, updated_at: ConvertData.getDateNowStr() }, req.body.tvShowEpisodeId).then(valueUpdate => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                })
            }
        })
    }

    public updateById(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowEpisodeDAO = new TvShowEpisodeDAO()
                tvShowEpisodeDAO.updateById({ name: req.body.name, updated_at: ConvertData.getDateNowStr() }, req.body.tvShowEpisodeId).then(valueUpdate => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                })
            }
        })
    }

    public openById(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowEpisodeDAO = new TvShowEpisodeDAO()
                tvShowEpisodeDAO.openById(req.body.tvShowEpisodeId).then(async valueJson => {
                    const episode = TvShowEpisodeGetObjectForJson(valueJson!!, req.userAuth)
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, episode))
                }).catch(err => console.log(err))
            }
        })
    }

    public create(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowEpisodeDAO = new TvShowEpisodeDAO()
                const reviewed = req.userAuth.level == "ADMIN"
                tvShowEpisodeDAO.create(req.body.name, req.body.tvShowSeasonId, req.userAuth._id, reviewed, ConvertData.getDateNowStr()).then(async valueId => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueId))
                }).catch(err => console.log(err))
            }
        })
    }

    public getAll(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowEpisodeDAO = new TvShowEpisodeDAO()
                tvShowEpisodeDAO.getAllByTvShowSeasonIdAndStatus(req.body.tvShowSeasonId, true).then(async valuesJson => {
                    let episodes = valuesJson.map(vj => TvShowEpisodeGetObjectForJson(vj, req.userAuth))
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