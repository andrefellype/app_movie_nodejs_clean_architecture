import { Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import DataReturnResponse from '../core/DataReturnResponse'
import DataJsonResponse from '../core/DataJsonResponse'
import ActorController from '../../usercases/ActorController'
import ActorDAO from '../../data/actor/ActorDAO'

class ActorRouter {
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
        return this.routes.put('/actor/delete', body('actorId').notEmpty(), this.verifyJWT, ActorController.deleteById)
    }

    private deleteById() {
        return this.routes.delete('/actor/delete/:actorId', this.verifyJWT, ActorController.deleteById)
    }

    private updateApprovedById() {
        return this.routes.get('/actor/approved/:actorId', this.verifyJWT, ActorController.updateApprovedById)
    }

    private updateById() {
        const actorDAO = new ActorDAO()
        return this.routes.put('/actor/update/:actorId', body('name').notEmpty()
            .withMessage("Nome obrigatório.").custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    if (req.params!!.actorId != null && req.params!!.actorId.length > 0) {
                        actorDAO.findByName(value).then((valueJson) => {
                            if (valueJson != null && valueJson._id != req.params!!.actorId) {
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
            }), this.verifyJWT, ActorController.updateById)
    }

    private openById() {
        return this.routes.get('/actor/open/:actorId', this.verifyJWT, ActorController.openById)
    }

    private create() {
        const actorDAO = new ActorDAO()
        return this.routes.post('/actor/register', body('reviewed').notEmpty(), body('name').notEmpty().withMessage("Nome obrigatório.")
            .custom(async (value) => {
                return new Promise((resolve, reject) => {
                    actorDAO.findByName(value).then((valueJson) => {
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
            }), this.verifyJWT, ActorController.create)
    }

    private openAllByAuthorized() {
        return this.routes.get('/actor/open/authorized', this.verifyJWT, ActorController.openAllByAuthorized)
    }

    private openAll() {
        return this.routes.get('/actor/open', this.verifyJWT, ActorController.openAll)
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

export default new ActorRouter()