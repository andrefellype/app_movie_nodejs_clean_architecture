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
        this.openAll()
        this.openAllByAuthorized()
        this.create()
        this.openById()
        this.updateById()
        this.updateApprovedById()
        this.deleteById()
        this.deleteAllByIds()
    }

    private deleteAllByIds() {
        return this.routes.put('/stream/delete', body('streamId').notEmpty(), this.verifyJWT, StreamController.deleteById)
    }

    private deleteById() {
        return this.routes.delete('/stream/delete/:streamId', this.verifyJWT, StreamController.deleteById)
    }

    private updateApprovedById() {
        return this.routes.get('/stream/approved/:streamId', this.verifyJWT, StreamController.updateApprovedById)
    }

    private updateById() {
        const streamDAO = new StreamDAO()
        return this.routes.put('/stream/update/:streamId', body('name').notEmpty()
            .withMessage("Nome obrigatório.").custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    if (req.params!!.streamId != null && req.params!!.streamId.length > 0) {
                        streamDAO.findByName(value).then((valueJson) => {
                            if (valueJson != null && valueJson._id != req.params!!.streamId) {
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
        return this.routes.get('/stream/open/:streamId', this.verifyJWT, StreamController.openById)
    }

    private create() {
        const streamDAO = new StreamDAO()
        return this.routes.post('/stream/register', body('reviewed').notEmpty(), body('name')
            .notEmpty().withMessage("Nome obrigatório.").custom(async (value) => {
                return new Promise((resolve, reject) => {
                    streamDAO.findByName(value).then((valueJson) => {
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

    private openAllByAuthorized() {
        return this.routes.get('/stream/open/authorized', this.verifyJWT, StreamController.openAllByAuthorized)
    }

    private openAll() {
        return this.routes.get('/stream/open', this.verifyJWT, StreamController.openAll)
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