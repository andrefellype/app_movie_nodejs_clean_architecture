import { Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import DataReturnResponse from '../core/DataReturnResponse'
import DataJsonResponse from '../core/DataJsonResponse'
import StreamDAO from '../../data/stream/StreamDAO'
import StreamController from '../../usercases/StreamController'

class StreamRouter {
    private routes: Router

    public getRoutes(routes: Router) {
        this.routes = routes
        this.getAll()
        this.create()
        this.openById()
        this.updateById()
        this.updateApprovedById()
        this.deleteById()
        this.deleteSeveralByIds()
    }

    private deleteSeveralByIds() {
        return this.routes.post('/stream/delete/several', body('_ids').notEmpty(), this.verifyJWT, StreamController.deleteSeveralByIds)
    }

    private deleteById() {
        return this.routes.post('/stream/delete', body('streamId').notEmpty(), this.verifyJWT, StreamController.deleteById)
    }

    private updateApprovedById() {
        return this.routes.post('/stream/approved/reviewed', body('streamId').notEmpty(), this.verifyJWT, StreamController.updateApprovedById)
    }

    private updateById() {
        const streamDAO = new StreamDAO()
        return this.routes.post('/stream/update', body('streamId').notEmpty(), body('name').notEmpty().withMessage("Nome obrigatório.").custom(async (value, { req }) => {
            return new Promise((resolve, reject) => {
                if (req.body.streamId != null && req.body.streamId.length > 0) {
                    streamDAO.openByName(value).then((valueJson) => {
                        if (valueJson != null && valueJson._id != req.body.streamId) {
                            DataReturnResponse.returnReject(reject, new Error('Nome já existente.'))
                        } else {
                            DataReturnResponse.returnResolve(resolve, true)
                        }
                    }).catch(err => {
                        DataReturnResponse.returnReject(reject, new Error(err.message))
                    })
                } else {
                    DataReturnResponse.returnResolve(resolve, true)
                }
            }).catch(err => {
                throw new Error(err.message)
            })
        }), this.verifyJWT, StreamController.updateById)
    }

    private openById() {
        return this.routes.post('/stream/open', body('streamId').notEmpty(), this.verifyJWT, StreamController.openById)
    }

    private create() {
        const streamDAO = new StreamDAO()
        return this.routes.post('/stream/register', body('reviewed').notEmpty(), body('name').notEmpty().withMessage("Nome obrigatório.")
            .custom(async (value) => {
                return new Promise((resolve, reject) => {
                    streamDAO.openByName(value).then((valueJson) => {
                        if (valueJson != null) {
                            DataReturnResponse.returnReject(reject, new Error('Nome já existente.'))
                        } else {
                            DataReturnResponse.returnResolve(resolve, true)
                        }
                    }).catch(err => {
                        DataReturnResponse.returnReject(reject, new Error(err.message))
                    })
                }).catch(err => {
                    throw new Error(err.message)
                })
            }), this.verifyJWT, StreamController.create)
    }

    private getAll() {
        return this.routes.post('/stream/open/all', body('listGeneral').notEmpty(), this.verifyJWT, StreamController.getAll)
    }

    private verifyJWT(req, res, next) {
        const token = req.headers['x-access-token']
        jwt.verify(token, "appmovie", (err, decoded) => {
            if (err) return DataJsonResponse.responseValidationFail(res, [{ msg: "token_invalidate" }])
            req.userAuth = decoded.userAuth
            next()
        })
    }
}

export default new StreamRouter()