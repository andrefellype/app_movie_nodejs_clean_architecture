import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import DirectorDAO from '../data/director/DirectorDAO'
import { GetDirectorByJson } from '../domain/entity/director/DirectorConst'
import MovieController from './MovieController'

class DirectorController {
    private static async deleteLocalByIds(idsDirector: string[], directorDAO: DirectorDAO) {
        await directorDAO.findAllByIds(idsDirector).then(async valueJson => {
            const idsDelete: string[] = []
            const idsUpdate: string[] = []
            for (let v = 0; v < valueJson.length; v++) {
                if (!valueJson[v].reviewed) {
                    idsDelete.push(valueJson[v]._id)
                } else {
                    idsUpdate.push(valueJson[v]._id)
                }
            }
            await MovieController.deleteAllInformationMovie(idsDelete, "directors")
            await directorDAO.deleteAllByIds(idsDelete)
            await directorDAO.updateByIds({ status: false, "updated_at": ConvertData.getDateNowStr() }, idsUpdate)
        })
    }

    public deleteById(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                let directorIds: string[] = []
                if (typeof req.route.methods.put != "undefined" && req.route.methods.put) {
                    directorIds = JSON.parse(req.body.directorId)
                } else {
                    directorIds.push(req.params.directorId)
                }
                await DirectorController.deleteLocalByIds(directorIds, (new DirectorDAO()))
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
                const directorDAO = new DirectorDAO()
                directorDAO.updateById({ reviewed: true, updated_at: ConvertData.getDateNowStr() }, req.params.directorId).then(async valueUpdate => {
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
                const directorDAO = new DirectorDAO()
                directorDAO.updateById({ name: req.body.name, updated_at: ConvertData.getDateNowStr() },
                    req.params.directorId).then(async valueUpdate => {
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
                const directorDAO = new DirectorDAO()
                directorDAO.find(req.params.directorId).then(async valueJson => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, GetDirectorByJson(valueJson!!)))
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
                const directorDAO = new DirectorDAO()
                directorDAO.create(req.body.name, req.userAuth._id, (req.body.reviewed == 1), ConvertData.getDateNowStr()).then(async valueId => {
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
                const directorDAO = new DirectorDAO()
                directorDAO.findAllByStatus(true).then(async valuesJson => {
                    const idAuth = req.userAuth != null ? req.userAuth._id : null
                    let directors = valuesJson.map(vj => GetDirectorByJson(vj, idAuth))
                    if (req.userAuth != null) {
                        directors = directors.filter(d => d.reviewed || (d.user_register == req.userAuth._id))
                    } else {
                        directors = directors.filter(d => d.reviewed)
                    }
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, directors))
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
                const directorDAO = new DirectorDAO()
                directorDAO.findAllByStatus(true).then(async valuesJson => {
                    const idAuth = req.userAuth != null ? req.userAuth._id : null
                    const directors = valuesJson.map(vj => GetDirectorByJson(vj, idAuth))
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, directors))
                }).catch(err => console.log(err))
            }
        })
    }
}

export default new DirectorController()