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
    public async deleteEpisodeAllByTvShowId(tvShowIds: object[]) {
        const tvShowSeasonDAO = new TvShowSeasonDAO()
        const tvShowEpisodeDAO = new TvShowEpisodeDAO()
        await tvShowSeasonDAO.getAllByTvShowId(tvShowIds).then(async seasonsJson => {
            const tvShowSeasonIds = seasonsJson.map(s => (new ObjectId(s._id)))
            await tvShowEpisodeDAO.getAllByTvShowSeasonIds(tvShowSeasonIds).then(async valueJson => {
                const idsDelete: object[] = []
                for (let v = 0; v < valueJson.length; v++) {
                    idsDelete.push((new ObjectId(valueJson[v]._id)))
                }
                await MyTvShowController.deleteMyTvShowEpisodeAllByTvShowEpisodeId(idsDelete)
                await tvShowEpisodeDAO.deleteAll({ _id: { $in: idsDelete } })
            })
        })
    }

    public async deleteEpisodeAllByTvSeasonId(tvShowSeasonIds: object[]) {
        const tvShowEpisodeDAO = new TvShowEpisodeDAO()
        await tvShowEpisodeDAO.getAllByTvShowSeasonIds(tvShowSeasonIds).then(async valueJson => {
            const idsDelete: object[] = []
            for (let v = 0; v < valueJson.length; v++) {
                idsDelete.push((new ObjectId(valueJson[v]._id)))
            }
            await MyTvShowController.deleteMyTvShowEpisodeAllByTvShowEpisodeId(idsDelete)
        })
        const _ids = tvShowSeasonIds
        await tvShowEpisodeDAO.deleteAll({ tv_show_season_id: { $in: _ids } })
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

    private static async deleteEpisode(tvShowEpisodeIds: string[], tvShowEpisodeDAO: TvShowEpisodeDAO) {
        await tvShowEpisodeDAO.getAllByIds(tvShowEpisodeIds).then(async valueJson => {
            const idsDelete: object[] = []
            const idsUpdate: object[] = []
            for (let v = 0; v < valueJson.length; v++) {
                if (!valueJson[v].reviewed) {
                    idsDelete.push((new ObjectId(valueJson[v]._id)))
                } else {
                    idsUpdate.push((new ObjectId(valueJson[v]._id)))
                }
            }
            await MyTvShowController.deleteMyTvShowEpisodeAllByTvShowEpisodeId(idsDelete)
            await tvShowEpisodeDAO.deleteAll({ _id: { $in: idsDelete } })
            await tvShowEpisodeDAO.updateByWhere({ status: false, "updated_at": ConvertData.getDateNowStr() }, { _id: { $in: idsUpdate } })
        })
    }

    public deleteSeveral(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const ids = JSON.parse(req.body._ids)
                await TvShowEpisodeController.deleteEpisode(ids, (new TvShowEpisodeDAO()))
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public delete(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                await TvShowEpisodeController.deleteEpisode([req.body.tvShowEpisodeId], (new TvShowEpisodeDAO()))
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public approved(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowEpisodeDAO = new TvShowEpisodeDAO()
                tvShowEpisodeDAO.updateByWhere({ reviewed: true, updated_at: ConvertData.getDateNowStr() }, { _id: new ObjectId(req.body.tvShowEpisodeId) }).then(valueUpdate => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                })
            }
        })
    }

    public update(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowEpisodeDAO = new TvShowEpisodeDAO()
                tvShowEpisodeDAO.updateByWhere({ name: req.body.name, updated_at: ConvertData.getDateNowStr() }, { _id: new ObjectId(req.body.tvShowEpisodeId) }).then(valueUpdate => {
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
                tvShowEpisodeDAO.open(req.body.tvShowEpisodeId).then(async valueJson => {
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