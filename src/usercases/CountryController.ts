import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import CountryDAO from '../data/country/CountryDAO'
import { GetCountryByJson } from '../domain/entity/country/CountryConst'
import MovieController from './MovieController'
import TvShowController from './TvShowController'

class CountryController {
    private static async deleteLocalByIds(idsCountry: string[], countryDAO: CountryDAO) {
        await countryDAO.findAllByIds(idsCountry).then(async valueJson => {
            const idsDelete: string[] = []
            const idsUpdate: string[] = []
            for (let v = 0; v < valueJson.length; v++) {
                if (!valueJson[v].reviewed) {
                    idsDelete.push(valueJson[v]._id)
                } else {
                    idsUpdate.push(valueJson[v]._id)
                }
            }
            await MovieController.deleteAllInformationMovie(idsDelete, "countries")
            await TvShowController.deleteAllInformationTvShow(idsDelete, "countries")
            await countryDAO.deleteAllByIds(idsDelete)
            await countryDAO.updateByIds({ status: false, "updated_at": ConvertData.getDateNowStr() }, idsUpdate)
        })
    }

    public deleteById(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                let countryIds: string[] = []
                if (typeof req.route.methods.put != "undefined" && req.route.methods.put) {
                    countryIds = JSON.parse(req.body.countryId)
                } else {
                    countryIds.push(req.params.countryId)
                }
                await CountryController.deleteLocalByIds(countryIds, (new CountryDAO()))
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public updateApprovedById(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const countryDAO = new CountryDAO()
                countryDAO.updateById({ reviewed: true, updated_at: ConvertData.getDateNowStr() },
                    req.params.countryId).then(async valueUpdate => {
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
                const countryDAO = new CountryDAO()
                countryDAO.updateById({ initial: req.body.initial, updated_at: ConvertData.getDateNowStr() },
                    req.params.countryId).then(async valueUpdate => {
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
                const countryDAO = new CountryDAO()
                countryDAO.find(req.params.countryId).then(async valueJson => {
                    DataReturnResponse.returnResolve(resolve,
                        DataJsonResponse.responseObjectJson(res, GetCountryByJson(valueJson!!)))
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
                const countryDAO = new CountryDAO()
                countryDAO.create(req.body.initial, req.userAuth._id, (req.body.reviewed == 1),
                    ConvertData.getDateNowStr()).then(async valueId => {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueId))
                    }).catch(err => console.log(err))
            }
        })
    }

    public openAllByAuthorized(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const countryDAO = new CountryDAO()
                countryDAO.findAllByStatus(true).then(async valuesJson => {
                    const idAuth = req.userAuth != null ? req.userAuth._id : null
                    let countries = valuesJson.map(vj => GetCountryByJson(vj, idAuth))
                    if (req.userAuth != null) {
                        countries = countries.filter(d => d.reviewed || (d.user_register == req.userAuth._id))
                    } else {
                        countries = countries.filter(d => d.reviewed)
                    }
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, countries))
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
                const countryDAO = new CountryDAO()
                countryDAO.findAllByStatus(true).then(async valuesJson => {
                    const idAuth = req.userAuth != null ? req.userAuth._id : null
                    const countries = valuesJson.map(vj => GetCountryByJson(vj, idAuth))
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, countries))
                }).catch(err => console.log(err))
            }
        })
    }
}

export default new CountryController()