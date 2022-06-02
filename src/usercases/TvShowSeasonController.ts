import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { ObjectId } from 'mongodb'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import MyTvShowEpisodeDAO from '../data/myTvShowEpisode/MyTvShowEpisodeDAO'
import MyTvShowEpisodeNeverWatchDAO from '../data/myTvShowEpisodeNeverWatch/MyTvShowEpisodeNeverWatchDAO'
import MyTvShowSeasonNeverWatchDAO from '../data/myTvShowSeasonNeverWatch/MyTvShowSeasonNeverWatchDAO'
import TvShowEpisodeDAO from '../data/tvShowEpisode/TvShowEpisodeDAO'
import TvShowSeasonDAO from '../data/tvShowSeason/TvShowSeasonDAO'
import { TvShowSeasonGetObjectForJson } from '../domain/entity/tvShowSeason/TvShowSeasonConst'
import MyTvShowController from './MyTvShowController'
import TvShowEpisodeController from './TvShowEpisodeController'

class TvShowSeasonController {
    public async deleteSeasonAllByTvShowId(tvShowIds: string[]) {
        const tvShowSeasonDAO = new TvShowSeasonDAO()
        await tvShowSeasonDAO.getAllByTvShowId(tvShowIds).then(async valueJson => {
            const idsDelete = []
            for (let v = 0; v < valueJson.length; v++) {
                idsDelete.push((new ObjectId(valueJson[v]._id)))
            }
            await MyTvShowController.deleteMyTvShowEpisodeAllByTvShowSeasonId(idsDelete)
            await MyTvShowController.deleteMyTvShowSeasonAllByTvShowSeasonId(idsDelete)
            await TvShowEpisodeController.deleteEpisodeAllByTvSeasonId(idsDelete)
            await tvShowSeasonDAO.deleteAll({ _id: { $in: idsDelete } })
        })
    }

    public getAllByNotMyTvShow(req: Request, res: Response): Promise<string> {
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
                tvShowSeasonDAO.getAllByTvShowIdAndStatus(req.body.tvShowId, true).then(async valuesJson => {
                    let seasons = valuesJson.map(vj => TvShowSeasonGetObjectForJson(vj, req.userAuth))
                    if (req.userAuth.level != "ADMIN") {
                        seasons = seasons.filter(season => season.reviewed || (season.user_register == req.userAuth._id))
                    }
                    const seasonsNew = []
                    for (let s = 0; s < seasons.length; s++) {
                        let statusSeason = true
                        let countEpisode = 0
                        let countWatch = 0
                        await tvShowEpisodeDAO.countByTvShowSeasonIdAndStatus(seasons[s]._id, true).then(countJson => {
                            countEpisode = countJson
                        })
                        await myTvShowEpisodeDAO.countByTvShowSeasonIdAndUserId(seasons[s]._id, req.userAuth._id).then(countJson => {
                            countWatch += countJson
                        })
                        await myTvShowEpisodeNeverWatchDAO.countByTvShowSeasonIdAndUserId(seasons[s]._id, req.userAuth._id).then(countJson => {
                            countWatch += countJson
                        })
                        if (countEpisode <= countWatch) {
                            statusSeason = false
                        }
                        await myTvShowSeasonNeverWatchDAO.openByTvShowSeasonIdAndUserId(seasons[s]._id, req.userAuth._id).then(mtssnw => {
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

    private static async deleteSeason(idsSeason: string[], tvShowSeasonDAO: TvShowSeasonDAO, tvShowEpisodeDAO: TvShowEpisodeDAO) {
        await tvShowSeasonDAO.getAllByIds(idsSeason).then(async valueJson => {
            const idsDelete = []
            const idsUpdate = []
            for (let v = 0; v < valueJson.length; v++) {
                if (!valueJson[v].reviewed) {
                    idsDelete.push((new ObjectId(valueJson[v]._id)))
                } else {
                    idsUpdate.push((new ObjectId(valueJson[v]._id)))
                }
            }
            await MyTvShowController.deleteMyTvShowEpisodeAllByTvShowSeasonId(idsDelete)
            await MyTvShowController.deleteMyTvShowSeasonAllByTvShowSeasonId(idsDelete)
            await TvShowEpisodeController.deleteEpisodeAllByTvSeasonId(idsDelete)
            await tvShowSeasonDAO.deleteAll({ _id: { $in: idsDelete } })
            await tvShowSeasonDAO.updateByWhere({ status: false, "updated_at": ConvertData.getDateNowStr() }, { _id: { $in: idsUpdate } })
        })
    }

    public deleteSeveral(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const ids = JSON.parse(req.body._ids)
                await TvShowSeasonController.deleteSeason(ids, (new TvShowSeasonDAO()), (new TvShowEpisodeDAO()))
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
                await TvShowSeasonController.deleteSeason([req.body.tvShowSeasonId], (new TvShowSeasonDAO()), (new TvShowEpisodeDAO()))
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
                const tvShowSeasonDAO = new TvShowSeasonDAO()
                tvShowSeasonDAO.updateByWhere({ reviewed: true, updated_at: ConvertData.getDateNowStr() }, { _id: new ObjectId(req.body.tvShowSeasonId) }).then(async valueUpdate => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                }).catch(err => console.log(err))
            }
        })
    }

    public update(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowSeasonDAO = new TvShowSeasonDAO()
                tvShowSeasonDAO.updateByWhere({ name: req.body.name, updated_at: ConvertData.getDateNowStr() }, { _id: new ObjectId(req.body.tvShowSeasonId) }).then(valueUpdate => {
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
                const tvShowSeasonDAO = new TvShowSeasonDAO()
                tvShowSeasonDAO.open(req.body.tvShowSeasonId).then(async valueJson => {
                    const season = TvShowSeasonGetObjectForJson(valueJson, req.userAuth)
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, season))
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
                const tvShowSeasonDAO = new TvShowSeasonDAO()
                const reviewed = req.userAuth.level == "ADMIN"
                tvShowSeasonDAO.create(req.body.name, req.body.tvShowId, req.userAuth._id, reviewed, ConvertData.getDateNowStr()).then(async valueId => {
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
                const tvShowSeasonDAO = new TvShowSeasonDAO()
                tvShowSeasonDAO.getAllByTvShowIdAndStatus(req.body.tvShowId, true).then(async valuesJson => {
                    let seasons = valuesJson.map(vj => TvShowSeasonGetObjectForJson(vj, req.userAuth))
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