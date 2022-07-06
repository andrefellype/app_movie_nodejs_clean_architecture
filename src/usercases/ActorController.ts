import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import ActorDAO from '../data/actor/ActorDAO'
import { GetActorByJson } from '../domain/entity/actor/ActorConst'
import MovieController from './MovieController'

class ActorController {
    private static async deleteLocalByIds(idsActor: string[], actorDAO: ActorDAO) {
        await actorDAO.findAllByIds(idsActor).then(async valueJson => {
            const idsDelete: string[] = []
            const idsUpdate: string[] = []
            for (let v = 0; v < valueJson.length; v++) {
                if (!valueJson[v].reviewed) {
                    idsDelete.push(valueJson[v]._id)
                } else {
                    idsUpdate.push(valueJson[v]._id)
                }
            }
            await MovieController.deleteAllInformationMovie(idsDelete, "casts")
            await actorDAO.deleteAllByIds(idsDelete)
            await actorDAO.updateByIds({ status: false, "updated_at": ConvertData.getDateNowStr() }, idsUpdate)
        })
    }

    public deleteById(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                let actorIds: string[] = []
                if (typeof req.route.methods.put != "undefined" && req.route.methods.put) {
                    actorIds = JSON.parse(req.body.actorId)
                } else {
                    actorIds.push(req.params.actorId)
                }
                await ActorController.deleteLocalByIds(actorIds, (new ActorDAO()))
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
                const actorDAO = new ActorDAO()
                actorDAO.updateById({ reviewed: true, updated_at: ConvertData.getDateNowStr() },
                    req.params.actorId).then(async valueUpdate => {
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
                const actorDAO = new ActorDAO()
                actorDAO.updateById({ name: req.body.name, updated_at: ConvertData.getDateNowStr() },
                    req.params.actorId).then(async valueUpdate => {
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
                const actorDAO = new ActorDAO()
                actorDAO.find(req.params.actorId).then(async valueJson => {
                    DataReturnResponse.returnResolve(resolve,
                        DataJsonResponse.responseObjectJson(res, GetActorByJson(valueJson!!)))
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
                const actorDAO = new ActorDAO()
                actorDAO.create(req.body.name, req.userAuth._id, (req.body.reviewed == 1),
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
                const actorDAO = new ActorDAO()
                actorDAO.findAllByStatus(true).then(async valuesJson => {
                    const idAuth = req.userAuth != null ? req.userAuth._id : null
                    let actors = valuesJson.map(vj => GetActorByJson(vj, idAuth))
                    if (req.userAuth != null) {
                        actors = actors.filter(d => d.reviewed || (d.user_register == req.userAuth._id))
                    } else {
                        actors = actors.filter(d => d.reviewed)
                    }
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, actors))
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
                const actorDAO = new ActorDAO()
                actorDAO.findAllByStatus(true).then(async valuesJson => {
                    const idAuth = req.userAuth != null ? req.userAuth._id : null
                    const actors = valuesJson.map(vj => GetActorByJson(vj, idAuth))
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, actors))
                }).catch(err => console.log(err))
            }
        })
    }
}

export default new ActorController()