import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import { ObjectId } from 'mongodb'
import ActorDAO from '../data/actor/ActorDAO'
import { ActorGetObjectForJson } from '../domain/entity/actor/ActorConst'
import MovieController from './MovieController'

class ActorController {
    private static async deleteActor(idsActor: string[], actorDAO: ActorDAO) {
        await actorDAO.getAllByIds(idsActor).then(async valueJson => {
            const idsDelete = []
            const idsUpdate = []
            for (let v = 0; v < valueJson.length; v++) {
                if (!valueJson[v].reviewed) {
                    idsDelete.push((new ObjectId(valueJson[v]._id)))
                } else {
                    idsUpdate.push((new ObjectId(valueJson[v]._id)))
                }
            }
            await MovieController.deleteMovieOtherInformation(idsDelete, "casts")
            await actorDAO.deleteAll({ _id: { $in: idsDelete } })
            await actorDAO.updateByWhere({ status: false, "updated_at": ConvertData.getDateNowStr() }, { _id: { $in: idsUpdate } })
        })
    }

    public deleteSeveral(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const ids = JSON.parse(req.body._ids)
                await ActorController.deleteActor(ids, (new ActorDAO()))
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
                await ActorController.deleteActor([req.body.actorId], (new ActorDAO()))
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
                const actorDAO = new ActorDAO()
                actorDAO.updateByWhere({ reviewed: true, updated_at: ConvertData.getDateNowStr() }, { _id: new ObjectId(req.body.actorId) }).then(async valueUpdate => {
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
                const actorDAO = new ActorDAO()
                actorDAO.updateByWhere({ name: req.body.name, updated_at: ConvertData.getDateNowStr() }, { _id: new ObjectId(req.body.actorId) }).then(async valueUpdate => {
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
                const actorDAO = new ActorDAO()
                actorDAO.open(req.body.actorId).then(async valueJson => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, ActorGetObjectForJson(valueJson)))
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
                const actorDAO = new ActorDAO()
                actorDAO.create(req.body.name, req.userAuth._id, (req.body.reviewed == 1), ConvertData.getDateNowStr()).then(async valueId => {
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
                const actorDAO = new ActorDAO()
                actorDAO.getAllByStatus(true).then(async valuesJson => {
                    const idAuth = req.userAuth != null ? req.userAuth._id : null
                    let actors = valuesJson.map(vj => ActorGetObjectForJson(vj, idAuth))
                    if (req.body.listGeneral == 0) {
                        if (req.userAuth != null) {
                            actors = actors.filter(d => d.reviewed || (d.user_register == req.userAuth._id))
                        } else {
                            actors = actors.filter(d => d.reviewed)
                        }
                    }
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, actors))
                }).catch(err => console.log(err))
            }
        })
    }
}

export default new ActorController()