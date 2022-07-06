import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import StreamDAO from '../data/stream/StreamDAO'
import { GetStreamByJson } from '../domain/entity/stream/StreamConst'
import MovieController from './MovieController'
import TvShowController from './TvShowController'

class StreamController {
    private static async deleteLocalByIds(idsStream: string[], streamDAO: StreamDAO) {
        await streamDAO.findAllByIds(idsStream).then(async valueJson => {
            const idsDelete: string[] = []
            const idsUpdate: string[] = []
            for (let v = 0; v < valueJson.length; v++) {
                if (!valueJson[v].reviewed) {
                    idsDelete.push(valueJson[v]._id)
                } else {
                    idsUpdate.push(valueJson[v]._id)
                }
            }
            await MovieController.deleteAllInformationMovie(idsDelete, "streams")
            await TvShowController.deleteAllInformationTvShow(idsDelete, "streams")
            await streamDAO.deleteAllByIds(idsDelete)
            await streamDAO.updateByIds({ status: false, "updated_at": ConvertData.getDateNowStr() }, idsUpdate)
        })
    }

    public deleteById(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                let streamIds: string[] = []
                if (typeof req.route.methods.put != "undefined" && req.route.methods.put) {
                    streamIds = JSON.parse(req.body.streamId)
                } else {
                    streamIds.push(req.params.streamId)
                }
                await StreamController.deleteLocalByIds(streamIds, (new StreamDAO()))
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
                const streamDAO = new StreamDAO()
                streamDAO.updateById({ reviewed: true, updated_at: ConvertData.getDateNowStr() }, req.params.streamId).then(async valueUpdate => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                }).catch(err => console.log(err))
            }
        })
    }

    public updateById(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const streamDAO = new StreamDAO()
                streamDAO.updateById({ name: req.body.name, updated_at: ConvertData.getDateNowStr() }, req.params.streamId).then(async valueUpdate => {
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
                const streamDAO = new StreamDAO()
                streamDAO.find(req.params.streamId).then(async valueJson => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, GetStreamByJson(valueJson!!)))
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
                const streamDAO = new StreamDAO()
                streamDAO.create(req.body.name, req.userAuth._id, (req.body.reviewed == 1), ConvertData.getDateNowStr()).then(async valueId => {
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
                const streamDAO = new StreamDAO()
                streamDAO.findAllByStatus(true).then(async valuesJson => {
                    const idAuth = req.userAuth != null ? req.userAuth._id : null
                    let streams = valuesJson.map(vj => GetStreamByJson(vj, idAuth))
                    if (req.userAuth != null) {
                        streams = streams.filter(d => d.reviewed || (d.user_register == req.userAuth._id))
                    } else {
                        streams = streams.filter(d => d.reviewed)
                    }
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, streams))
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
                const streamDAO = new StreamDAO()
                streamDAO.findAllByStatus(true).then(async valuesJson => {
                    const idAuth = req.userAuth != null ? req.userAuth._id : null
                    const streams = valuesJson.map(vj => GetStreamByJson(vj, idAuth))
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, streams))
                }).catch(err => console.log(err))
            }
        })
    }
}

export default new StreamController()