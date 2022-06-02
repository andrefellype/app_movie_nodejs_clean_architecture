import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import { ObjectId } from 'mongodb'
import StreamDAO from '../data/stream/StreamDAO'
import { StreamGetObjectForJson } from '../domain/entity/stream/StreamConst'
import MovieDAO from '../data/movie/MovieDAO'
import TvShowDAO from '../data/tvShow/TvShowDAO'
import MovieController from './MovieController'
import TvShowController from './TvShowController'

class StreamController {
    private static async deleteStream(idsStream: string[], streamDAO: StreamDAO, movieDAO: MovieDAO, tvShowDAO: TvShowDAO) {
        await streamDAO.getAllByIds(idsStream).then(async valueJson => {
            const idsDelete = []
            const idsUpdate = []
            for (let v = 0; v < valueJson.length; v++) {
                if (!valueJson[v].reviewed) {
                    idsDelete.push((new ObjectId(valueJson[v]._id)))
                } else {
                    idsUpdate.push((new ObjectId(valueJson[v]._id)))
                }
            }
            await MovieController.deleteMovieOtherInformation(idsDelete, "streams")
            await TvShowController.deleteTvShowOtherInformation(idsDelete, "streams")
            await streamDAO.deleteAll({ _id: { $in: idsDelete } })
            await streamDAO.updateByWhere({ status: false, "updated_at": ConvertData.getDateNowStr() }, { _id: { $in: idsUpdate } })
        })
    }

    public deleteSeveral(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const ids = JSON.parse(req.body._ids)
                await StreamController.deleteStream(ids, (new StreamDAO()), (new MovieDAO()), (new TvShowDAO()))
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
                await StreamController.deleteStream([req.body.streamId], (new StreamDAO()), (new MovieDAO()), (new TvShowDAO()))
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
                const streamDAO = new StreamDAO()
                streamDAO.updateByWhere({ reviewed: true, updated_at: ConvertData.getDateNowStr() }, { _id: new ObjectId(req.body.streamId) }).then(async valueUpdate => {
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
                const streamDAO = new StreamDAO()
                streamDAO.updateByWhere({ name: req.body.name, updated_at: ConvertData.getDateNowStr() }, { _id: new ObjectId(req.body.streamId) }).then(async valueUpdate => {
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
                streamDAO.open(req.body.streamId).then(async valueJson => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, StreamGetObjectForJson(valueJson)))
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

    public getAll(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const streamDAO = new StreamDAO()
                streamDAO.getAllByStatus(true).then(async valuesJson => {
                    const idAuth = req.userAuth != null ? req.userAuth._id : null
                    let streams = valuesJson.map(vj => StreamGetObjectForJson(vj, idAuth))
                    if (req.body.listGeneral == 0) {
                        if (req.userAuth != null) {
                            streams = streams.filter(d => d.reviewed || (d.user_register == req.userAuth._id))
                        } else {
                            streams = streams.filter(d => d.reviewed)
                        }
                    }
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, streams))
                }).catch(err => console.log(err))
            }
        })
    }
}

export default new StreamController()