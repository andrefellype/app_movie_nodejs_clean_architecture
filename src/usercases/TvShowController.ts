import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import { ObjectId } from 'mongodb'
import CategoryDAO from '../data/category/CategoryDAO'
import CountryDAO from '../data/country/CountryDAO'
import StreamDAO from '../data/stream/StreamDAO'
import TvShowDAO from '../data/tvShow/TvShowDAO'
import TvShowSeasonDAO from '../data/tvShowSeason/TvShowSeasonDAO'
import { TvShowGetObjectForJson } from '../domain/entity/tvShow/TvShowConst'
import TvShowEpisodeDAO from '../data/tvShowEpisode/TvShowEpisodeDAO'
import MyTvShowSeasonNeverWatchDAO from '../data/myTvShowSeasonNeverWatch/MyTvShowSeasonNeverWatchDAO'
import MyTvShowEpisodeNeverWatchDAO from '../data/myTvShowEpisodeNeverWatch/MyTvShowEpisodeNeverWatchDAO'
import MyTvShowEpisodeDAO from '../data/myTvShowEpisode/MyTvShowEpisodeDAO'
import MyTvShowNeverWatchDAO from '../data/myTvShowNeverWatch/MyTvShowNeverWatchDAO'
import MyTvShowController from './MyTvShowController'
import TvShowEpisodeController from './TvShowEpisodeController'
import TvShowSeasonController from './TvShowSeasonController'

class TvShowController {
    public async deleteTvShowOtherInformation(idsInformation: string[], typeInformation: string) {
        if (typeInformation == "countries") {
            const tvShowDAO = new TvShowDAO()
            await tvShowDAO.getAllByCountriesId(idsInformation).then(async tvShowsJson => {
                const valuesUpdate: { data: object, idValue: object }[] = []
                for (let s = 0; s < tvShowsJson.length; s++) {
                    const countries = tvShowsJson[s].countries_id.filter(f => idsInformation.filter(i => i.toString() == f.toString()).length == 0)
                    valuesUpdate.push({ data: { countries_id: countries }, idValue: new ObjectId(tvShowsJson[s]._id) })
                }
                for (let v = 0; v < valuesUpdate.length; v++) {
                    tvShowDAO.updateByWhere(valuesUpdate[v].data, { _id: valuesUpdate[v].idValue })
                }
            })
        } else if (typeInformation == "streams") {
            const tvShowDAO = new TvShowDAO()
            await tvShowDAO.getAllByStreamsId(idsInformation).then(async tvShowsJson => {
                const valuesUpdate: { data: object, idValue: object }[] = []
                for (let s = 0; s < tvShowsJson.length; s++) {
                    const streams = tvShowsJson[s].streams_id.filter(f => idsInformation.filter(i => i.toString() == f.toString()).length == 0)
                    valuesUpdate.push({ data: { streams_id: streams }, idValue: new ObjectId(tvShowsJson[s]._id) })
                }
                for (let v = 0; v < valuesUpdate.length; v++) {
                    tvShowDAO.updateByWhere(valuesUpdate[v].data, { _id: valuesUpdate[v].idValue })
                }
            })
        }
    }

    public getAllByNotMyTvShow(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowDAO = new TvShowDAO()
                tvShowDAO.getAllByStatus(true).then(async valuesJson => {
                    let tvShows = valuesJson.map(vj => TvShowGetObjectForJson(vj, req.userAuth))
                    if (req.userAuth.level != "ADMIN") {
                        tvShows = tvShows.filter(tvShow => tvShow.reviewed || (tvShow.user_register == req.userAuth._id))
                    }
                    for (let t = 0; t < tvShows.length; t++) {
                        await TvShowController.getAllDetailsTvShow(req, tvShows[t], true).then(valueTvShow => {
                            tvShows[t] = valueTvShow
                        })
                    }
                    tvShows = tvShows.filter(t => !t.statusMyTvShow)
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, tvShows))
                }).catch(err => console.log(err))
            }
        })
    }

    private static async deleteTvShow(idsTvShow: string[], tvShowDAO: TvShowDAO) {
        await tvShowDAO.getAllByIds(idsTvShow).then(async valueJson => {
            const idsDelete = []
            const idsUpdate = []
            for (let v = 0; v < valueJson.length; v++) {
                if (!valueJson[v].reviewed) {
                    idsDelete.push((new ObjectId(valueJson[v]._id)))
                } else {
                    idsUpdate.push((new ObjectId(valueJson[v]._id)))
                }
            }
            await MyTvShowController.deleteMyTvShowAllByTvShowId(idsDelete)
            await TvShowSeasonController.deleteSeasonAllByTvShowId(idsDelete)
            await TvShowEpisodeController.deleteEpisodeAllByTvShowId(idsDelete)
            await tvShowDAO.deleteAll({ _id: { $in: idsDelete } })
            await tvShowDAO.updateByWhere({ status: false, "updated_at": ConvertData.getDateNowStr() }, { _id: { $in: idsUpdate } })
        })
    }

    public deleteSeveral(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const ids = JSON.parse(req.body._ids)
                await TvShowController.deleteTvShow(ids, (new TvShowDAO()))
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
                await TvShowController.deleteTvShow([req.body.tvShowId], (new TvShowDAO()))
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public approved(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowDAO = new TvShowDAO()
                tvShowDAO.updateByWhere({ reviewed: true, updated_at: ConvertData.getDateNowStr() }, { _id: new ObjectId(req.body.tvShowId) }).then(async valueUpdate => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                }).catch(err => console.log(err))
            }
        })
    }

    public update(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowDAO = new TvShowDAO()
                const categories = req.body.categories.map(ca => new ObjectId(ca))
                const countries = req.body.countries.map(co => new ObjectId(co))
                const streams = req.body.streams.map(st => new ObjectId(st))
                tvShowDAO.updateByWhere({
                    title: req.body.title, release: req.body.release, resume: req.body.resume, categories_id: categories, countries_id: countries,
                    streams_id: streams, updated_at: ConvertData.getDateNowStr()
                }, { _id: new ObjectId(req.body.tvShowId) }).then(async valueUpdate => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                }).catch(err => console.log(err))
            }
        })
    }

    public openById(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowDAO = new TvShowDAO()
                tvShowDAO.open(req.body.tvShowId).then(async valueJson => {
                    let tvShow = TvShowGetObjectForJson(valueJson, req.userAuth)
                    await TvShowController.getAllDetailsTvShow(req, tvShow).then(valueDetails => tvShow = valueDetails)
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, tvShow))
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
                const tvShowDAO = new TvShowDAO()
                const reviewed = req.userAuth.level == "ADMIN"
                const categories = req.body.categories.map(ca => new ObjectId(ca))
                const countries = req.body.countries.map(co => new ObjectId(co))
                const streams = req.body.streams.map(st => new ObjectId(st))
                tvShowDAO.create(req.body.title, req.body.release, req.body.resume, categories, countries, streams, req.userAuth._id, reviewed, ConvertData.getDateNowStr()).then(async valueId => {
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
                const tvShowDAO = new TvShowDAO()
                tvShowDAO.getAllByStatus(true).then(async valuesJson => {
                    let tvShows = valuesJson.map(vj => TvShowGetObjectForJson(vj, req.userAuth))
                    if (req.userAuth.level != "ADMIN") {
                        tvShows = tvShows.filter(tvShow => tvShow.reviewed || (tvShow.user_register == req.userAuth._id))
                    }
                    for (let t = 0; t < tvShows.length; t++) {
                        await TvShowController.getAllDetailsTvShow(req, tvShows[t]).then(valueTvShow => {
                            tvShows[t] = valueTvShow
                        })
                    }
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, tvShows))
                }).catch(err => console.log(err))
            }
        })
    }

    private static async getAllDetailsTvShow(req, tvShow, validateNotMyTvShow = false) {
        const categoryDAO = new CategoryDAO()
        const countryDAO = new CountryDAO()
        const streamDAO = new StreamDAO()
        const tvShowSeasonDAO = new TvShowSeasonDAO()
        const tvShowEpisodeDAO = new TvShowEpisodeDAO()
        const myTvShowSeasonNeverWatchDAO = new MyTvShowSeasonNeverWatchDAO()
        const myTvShowEpisodeNeverWatchDAO = new MyTvShowEpisodeNeverWatchDAO()
        const myTvShowNeverWatchDAO = new MyTvShowNeverWatchDAO()
        const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()

        let statusMyTvShow = true
        if (req.userAuth != null) {
            if (validateNotMyTvShow) {
                let countEpisode = 0
                let countWatch = 0
                await tvShowSeasonDAO.getAllByTvShowIdAndStatus(tvShow._id, true).then(async valuesJson => {
                    const idsSeasons = valuesJson.map(v => v._id)
                    await tvShowEpisodeDAO.countByTvShowSeasonIdsAndStatus(idsSeasons, true).then(countJson => {
                        countEpisode = countJson
                    })
                    await myTvShowEpisodeDAO.countByTvShowIdAndUserId(tvShow._id, req.userAuth._id).then(countJson => {
                        countWatch += countJson
                    })
                    await myTvShowEpisodeNeverWatchDAO.countByTvShowIdAndUserId(tvShow._id, req.userAuth._id).then(countJson => {
                        countWatch += countJson
                    })
                    for (let s = 0; s < valuesJson.length; s++) {
                        await myTvShowSeasonNeverWatchDAO.openByTvShowSeasonIdAndUserId(valuesJson[s]._id, req.userAuth._id).then(async mtssnw => {
                            if (mtssnw != null) {
                                await tvShowEpisodeDAO.countByTvShowSeasonIdAndStatus(valuesJson[s]._id, true).then(countJson => {
                                    countWatch += countJson
                                })
                            }
                        })
                    }
                })
                await myTvShowNeverWatchDAO.openByTvShowIdAndUserId(tvShow._id, req.userAuth._id).then(async mtsnw => {
                    if(mtsnw != null || countEpisode <= countWatch){
                        statusMyTvShow = false
                    }
                    tvShow.statusMyTvShow = mtsnw != null || countEpisode <= countWatch
                })
            }
        }
        if (!validateNotMyTvShow || statusMyTvShow) {
            const tvShowCategories = []
            if (req.body.object == null || req.body.object.category) {
                for (let mca = 0; mca < tvShow.categories_id.length; mca++) {
                    await categoryDAO.open(tvShow.categories_id[mca]).then(valueJsonCategory => {
                        if (valueJsonCategory.status) {
                            tvShowCategories.push(valueJsonCategory)
                        }
                    })
                }
            }
            tvShow.categories = tvShowCategories

            const tvShowCountries = []
            if (req.body.object == null || req.body.object.country) {
                for (let mco = 0; mco < tvShow.countries_id.length; mco++) {
                    await countryDAO.open(tvShow.countries_id[mco]).then(valueJsonCountry => {
                        if (valueJsonCountry.status) {
                            tvShowCountries.push(valueJsonCountry)
                        }
                    })
                }
            }
            tvShow.countries = tvShowCountries

            const tvShowStreams = []
            if (req.body.object == null || req.body.object.stream) {
                for (let ms = 0; ms < tvShow.streams_id.length; ms++) {
                    await streamDAO.open(tvShow.streams_id[ms]).then(valueJsonStream => {
                        if (valueJsonStream.status) {
                            tvShowStreams.push(valueJsonStream)
                        }
                    })
                }
            }
            tvShow.streams = tvShowStreams
        }
        return tvShow
    }
}

export default new TvShowController()