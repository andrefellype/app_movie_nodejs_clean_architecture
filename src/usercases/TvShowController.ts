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
import { GetTvShowByJson } from '../domain/entity/tvShow/TvShowConst'
import TvShowEpisodeDAO from '../data/tvShowEpisode/TvShowEpisodeDAO'
import TvShowEpisodeController from './TvShowEpisodeController'
import TvShowSeasonController from './TvShowSeasonController'
import Category from '../domain/entity/category/Category'
import Country from '../domain/entity/country/Country'
import Stream from '../domain/entity/stream/Stream'
import MyTvShowSeasonNeverWatchDAO from '../data/myTvShowSeasonNeverWatch/MyTvShowSeasonNeverWatchDAO'
import MyTvShowEpisodeNeverWatchDAO from '../data/myTvShowEpisodeNeverWatch/MyTvShowEpisodeNeverWatchDAO'
import MyTvShowNeverWatchDAO from '../data/myTvShowNeverWatch/MyTvShowNeverWatchDAO'
import MyTvShowEpisodeDAO from '../data/myTvShowEpisode/MyTvShowEpisodeDAO'
import MyTvShowEpisodeController from './MyTvShowEpisodeController'
import MyTvShowEpisodeNeverWatchController from './MyTvShowEpisodeNeverWatchController'
import MyTvShowSeasonNeverWatchController from './MyTvShowSeasonNeverWatchController'
import MyTvShowNeverWatchController from './MyTvShowNeverWatchController'

class TvShowController {
    public async deleteAllInformationTvShow(idsInformation: string[], typeInformation: string) {
        if (typeInformation == "countries") {
            const tvShowDAO = new TvShowDAO()
            await tvShowDAO.findAllByCountriesIds(idsInformation).then(async tvShowsJson => {
                const valuesUpdate: { data: object, idValue: string }[] = []
                for (let s = 0; s < tvShowsJson.length; s++) {
                    const countries = tvShowsJson[s].countries_id.filter(f => idsInformation.filter(i => i.toString() == f.toString()).length == 0)
                    valuesUpdate.push({ data: { countries_id: countries }, idValue: tvShowsJson[s]._id })
                }
                for (let v = 0; v < valuesUpdate.length; v++) {
                    tvShowDAO.updateById(valuesUpdate[v].data, valuesUpdate[v].idValue)
                }
            })
        } else if (typeInformation == "streams") {
            const tvShowDAO = new TvShowDAO()
            await tvShowDAO.findAllByStreamsIds(idsInformation).then(async tvShowsJson => {
                const valuesUpdate: { data: object, idValue: string }[] = []
                for (let s = 0; s < tvShowsJson.length; s++) {
                    const streams = tvShowsJson[s].streams_id.filter(f => idsInformation.filter(i => i.toString() == f.toString()).length == 0)
                    valuesUpdate.push({ data: { streams_id: streams }, idValue: tvShowsJson[s]._id })
                }
                for (let v = 0; v < valuesUpdate.length; v++) {
                    tvShowDAO.updateById(valuesUpdate[v].data, valuesUpdate[v].idValue)
                }
            })
        }
    }

    public openAllByNotMyTvShow(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowDAO = new TvShowDAO()
                tvShowDAO.findAllByStatus(true).then(async valuesJson => {
                    let tvShows = valuesJson.map(vj => GetTvShowByJson(vj, req.userAuth))
                    if (req.userAuth.level != "ADMIN") {
                        tvShows = tvShows.filter(tvShow => tvShow.reviewed || (tvShow.user_register == req.userAuth._id))
                    }
                    for (let t = 0; t < tvShows.length; t++) {
                        await TvShowController.openAllDetailTvShow(req, tvShows[t], true, false).then(valueTvShow => {
                            tvShows[t] = valueTvShow
                        })
                    }
                    tvShows = tvShows.filter(t => !t.statusMyTvShow)
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, tvShows))
                }).catch(err => console.log(err))
            }
        })
    }

    private static async deleteLocalByIds(idsTvShow: string[], tvShowDAO: TvShowDAO) {
        await tvShowDAO.findAllByIds(idsTvShow).then(async valueJson => {
            const idsDelete: string[] = []
            const idsUpdate: string[] = []
            for (let v = 0; v < valueJson.length; v++) {
                if (!valueJson[v].reviewed) {
                    idsDelete.push(valueJson[v]._id)
                } else {
                    idsUpdate.push(valueJson[v]._id)
                }
            }
            await MyTvShowEpisodeController.deleteAllByTvShowIds(idsDelete)
            await MyTvShowEpisodeNeverWatchController.deleteAllByTvShowIds(idsDelete)
            await MyTvShowSeasonNeverWatchController.deleteAllByTvShowIds(idsDelete)
            await MyTvShowNeverWatchController.deleteAllByTvShowIds(idsDelete)
            await TvShowSeasonController.deleteSeasonAllByTvShowId(idsDelete)
            await TvShowEpisodeController.deleteAllByTvShowId(idsDelete)
            await tvShowDAO.deleteAllByIds(idsDelete)
            await tvShowDAO.updateByIds({ status: false, "updated_at": ConvertData.getDateNowStr() }, idsUpdate)
        })
    }

    public deleteById(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                let tvShowIds: string[] = []
                if (typeof req.route.methods.put != "undefined" && req.route.methods.put) {
                    tvShowIds = JSON.parse(req.body.tvShowId)
                } else {
                    tvShowIds.push(req.params.tvShowId)
                }
                await TvShowController.deleteLocalByIds(tvShowIds, (new TvShowDAO()))
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public updateApprovedById(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowDAO = new TvShowDAO()
                tvShowDAO.updateById({ reviewed: true, updated_at: ConvertData.getDateNowStr() },
                    req.params!!.tvShowId).then(async valueUpdate => {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                    }).catch(err => console.log(err))
            }
        })
    }

    public updateById(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowDAO = new TvShowDAO()
                const categories = req.body.categories.map(ca => new ObjectId(ca))
                const countries = req.body.countries.map(co => new ObjectId(co))
                const streams = req.body.streams.map(st => new ObjectId(st))
                tvShowDAO.updateById({
                    title: req.body.title, release: req.body.release, resume: req.body.resume,
                    categories_id: categories, countries_id: countries,
                    streams_id: streams, updated_at: ConvertData.getDateNowStr()
                }, req.params.tvShowId).then(async valueUpdate => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                }).catch(err => console.log(err))
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
                const tvShowDAO = new TvShowDAO()
                tvShowDAO.find(req.params.tvShowId).then(async valueJson => {
                    let tvShow = GetTvShowByJson(valueJson!!, req.userAuth)
                    await TvShowController.openAllDetailTvShow(req, tvShow).then(valueDetails =>
                        tvShow = valueDetails)
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, tvShow))
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
                const tvShowDAO = new TvShowDAO()
                const reviewed = req.userAuth.level == "ADMIN"
                const categories = req.body.categories.map(ca => new ObjectId(ca))
                const countries = req.body.countries.map(co => new ObjectId(co))
                const streams = req.body.streams.map(st => new ObjectId(st))
                tvShowDAO.create(req.body.title, req.body.release, req.body.resume, categories,
                    countries, streams, req.userAuth._id, reviewed, ConvertData.getDateNowStr())
                    .then(async valueId => {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueId))
                    }).catch(err => console.log(err))
            }
        })
    }

    public openTvShowDetailAll(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowDAO = new TvShowDAO()
                tvShowDAO.findAllByIds(req.body.tvShowIds).then(async valuesJson => {
                    let tvShows = valuesJson.map(vj => GetTvShowByJson(vj, req.userAuth))
                    for (let t = 0; t < tvShows.length; t++) {
                        await TvShowController.openAllDetailTvShow(req, tvShows[t]).then(valueTvShow => {
                            tvShows[t] = valueTvShow
                        })
                    }
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, tvShows))
                }).catch(err => console.log(err))
            }
        })
    }

    public openAll(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const tvShowDAO = new TvShowDAO()
                tvShowDAO.findAllByStatus(true).then(async valuesJson => {
                    let tvShows = valuesJson.map(vj => GetTvShowByJson(vj, req.userAuth))
                    if (req.userAuth.level != "ADMIN") {
                        tvShows = tvShows.filter(tvShow => tvShow.reviewed || (tvShow.user_register == req.userAuth._id))
                    }
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, tvShows))
                }).catch(err => console.log(err))
            }
        })
    }

    private static async openAllDetailTvShow(req, tvShow, validateNotMyTvShow = false, viewDetails = true) {
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
                await tvShowSeasonDAO.findAllIdsByTvShowIdAndStatus(tvShow._id, true).then(async valuesIdSeasonJson => {
                    const idsSeasons = valuesIdSeasonJson.map(v => v._id)
                    await tvShowEpisodeDAO.countAllByTvShowSeasonIdsAndStatus(idsSeasons, true).then(countJson => {
                        countEpisode = countJson
                    })
                    await myTvShowEpisodeDAO.countAllByTvShowIdAndUserId(tvShow._id, req.userAuth._id).then(countJson => {
                        countWatch += countJson
                    })
                    await myTvShowEpisodeNeverWatchDAO.countAllByTvShowIdAndUserId(tvShow._id, req.userAuth._id).then(countJson => {
                        countWatch += countJson
                    })
                    for (let s = 0; s < idsSeasons.length; s++) {
                        await myTvShowSeasonNeverWatchDAO.findByTvShowSeasonIdAndUserId(idsSeasons[s], req.userAuth._id).then(async mtssnw => {
                            if (mtssnw != null) {
                                await tvShowEpisodeDAO.countAllByTvShowSeasonIdAndStatus(idsSeasons[s], true).then(countJson => {
                                    countWatch += countJson
                                })
                            }
                        })
                    }
                })
                await myTvShowNeverWatchDAO.findByTvShowIdAndUserId(tvShow._id, req.userAuth._id).then(async mtsnw => {
                    if (mtsnw != null || countEpisode <= countWatch) {
                        statusMyTvShow = false
                    }
                    tvShow.statusMyTvShow = mtsnw != null || countEpisode <= countWatch
                })
            }
        }
        if (viewDetails && (!validateNotMyTvShow || statusMyTvShow)) {
            const tvShowCategories: Category[] = []
            for (let mca = 0; mca < tvShow.categories_id.length; mca++) {
                await categoryDAO.find(tvShow.categories_id[mca]).then(valueJsonCategory => {
                    if (valueJsonCategory!!.status) {
                        tvShowCategories.push(valueJsonCategory!!)
                    }
                })
            }
            tvShow.categories = tvShowCategories

            const tvShowCountries: Country[] = []
            for (let mco = 0; mco < tvShow.countries_id.length; mco++) {
                await countryDAO.find(tvShow.countries_id[mco]).then(valueJsonCountry => {
                    let statusCountry = valueJsonCountry!!.status
                    if (req.userAuth.level != "ADMIN" && !valueJsonCountry!!.reviewed && valueJsonCountry!!.user_register != req.userAuth._id) {
                        statusCountry = false
                    }
                    if (statusCountry) {
                        tvShowCountries.push(valueJsonCountry!!)
                    }
                })
            }
            tvShow.countries = tvShowCountries

            const tvShowStreams: Stream[] = []
            for (let ms = 0; ms < tvShow.streams_id.length; ms++) {
                await streamDAO.find(tvShow.streams_id[ms]).then(valueJsonStream => {
                    let statusStream = valueJsonStream!!.status
                    if (req.userAuth.level != "ADMIN" && !valueJsonStream!!.reviewed && valueJsonStream!!.user_register != req.userAuth._id) {
                        statusStream = false
                    }
                    if (statusStream) {
                        tvShowStreams.push(valueJsonStream!!)
                    }
                })
            }
            tvShow.streams = tvShowStreams
        }
        return tvShow
    }
}

export default new TvShowController()