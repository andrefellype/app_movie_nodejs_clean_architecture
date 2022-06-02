import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import CategoryDAO from '../data/category/CategoryDAO'
import CountryDAO from '../data/country/CountryDAO'
import StreamDAO from '../data/stream/StreamDAO'
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
        await myTvShowEpisodeDAO.deleteAll({ tv_show_id: { $in: idsTvShow } })
        await myTvShowENeverWatchDAO.deleteAll({ tv_show_id: { $in: idsTvShow } })
        await myTvShowESeasonNeverWatchDAO.deleteAll({ tv_show_id: { $in: idsTvShow } })
        await myTvShowEpisodeNeverWatchDAO.deleteAll({ tv_show_id: { $in: idsTvShow } })
    }

    public async deleteMyTvShowSeasonAllByTvShowSeasonId(idsTvShowSeason: string[]) {
        const myTvShowSeasonNeverWatchDAO = new MyTvShowSeasonNeverWatchDAO()
        await myTvShowSeasonNeverWatchDAO.deleteAll({ tv_show_season_id: { $in: idsTvShowSeason } })
    }

    public async deleteMyTvShowEpisodeAllByTvShowSeasonId(idsTvShowSeason: string[]) {
        const myTvShowEpisodeNeverWatchDAO = new MyTvShowEpisodeNeverWatchDAO()
        const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()
        await myTvShowEpisodeNeverWatchDAO.deleteAll({ tv_show_season_id: { $in: idsTvShowSeason } })
        await myTvShowEpisodeDAO.deleteAll({ tv_show_season_id: { $in: idsTvShowSeason } })
    }

    public async deleteMyTvShowEpisodeAllByTvShowEpisodeId(idsTvShowEpisode: string[]) {
        const myTvShowEpisodeNeverWatchDAO = new MyTvShowEpisodeNeverWatchDAO()
        const myTvShowEpisodeDAO = new MyTvShowEpisodeDAO()
        await myTvShowEpisodeNeverWatchDAO.deleteAll({ tv_show_episode_id: { $in: idsTvShowEpisode } })
        await myTvShowEpisodeDAO.deleteAll({ tv_show_episode_id: { $in: idsTvShowEpisode } })
    }

    private static async deleteMyTvShow(tvShowId: string, userId: string, myTvShowEpisodeDAO: MyTvShowEpisodeDAO) {
        await myTvShowEpisodeDAO.deleteByTvShowIdAndUserId(tvShowId, userId)
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
                    myTvShowNeverWatchDAO.create(req.userAuth._id, req.body.tvShowId, ConvertData.getDateNowStr()).then(async valueId => {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueId))
                    }).catch(err => console.log(err))
                } else if (req.body.typeRegister == "season") {
                    const myTvShowSeasonNeverWatchDAO = new MyTvShowSeasonNeverWatchDAO()
                    myTvShowSeasonNeverWatchDAO.create(req.userAuth._id, req.body.tvShowSeasonId, req.body.tvShowId, ConvertData.getDateNowStr()).then(async valueId => {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueId))
                    }).catch(err => console.log(err))
                } else if (req.body.typeRegister == "episode") {
                    const myTvShowEpisodeNeverWatchDAO = new MyTvShowEpisodeNeverWatchDAO()
                    myTvShowEpisodeNeverWatchDAO.create(req.userAuth._id, req.body.tvShowEpisodeId, req.body.tvShowSeasonId, req.body.tvShowId, ConvertData.getDateNowStr()).then(async valueId => {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueId))
                    }).catch(err => console.log(err))
                } else {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, [{ msg: "Tipo de registro inválido" }]))
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
                    await myTvShowEpisodeDAO.create(req.userAuth._id, req.body.tvShowId, req.body.tvShowSeasonId, episodes[e]._id, ConvertData.getDateNowStr())
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
                            await tvShowDAO.open(valuesJson[v].tv_show_id).then(async valueTvShowJson => {
                                let tvShowValue = TvShowGetObjectForJson(valueTvShowJson, req.userAuth)
                                await MyTvShowController.getAllDetailsTvShow(req, tvShowValue).then(tsj => {
                                    tvShowValue = tsj
                                })
                                tvShows.push({ tvShow: tvShowValue, countEpisodeWatch: 1, percentage: 0 })
                            })
                        } else {
                            tvShows[posInsert].countEpisodeWatch = tvShows[posInsert].countEpisodeWatch + 1
                        }
                    }
                    const tvShowsNew = []
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

    private static async getAllDetailsTvShow(req, tvShow) {
        const categoryDAO = new CategoryDAO()
        const countryDAO = new CountryDAO()
        const streamDAO = new StreamDAO()

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

        return tvShow
    }
}

export default new MyTvShowController()