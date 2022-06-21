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
        this.getAll()
        this.create()
        this.openById()
        this.updateById()
        this.updateApprovedById()
        this.deleteById()
        this.deleteSeveralByIds()
    }

    private deleteSeveralByIds() {
        return this.routes.post('/actor/delete/several', body('_ids').notEmpty(), this.verifyJWT, ActorController.deleteSeveralByIds)
    }

    private deleteById() {
        return this.routes.post('/actor/delete', body('actorId').notEmpty(), this.verifyJWT, ActorController.deleteById)
    }

    private updateApprovedById() {
        return this.routes.post('/actor/approved/reviewed', body('actorId').notEmpty(), this.verifyJWT, ActorController.updateApprovedById)
    }

    private updateById() {
        const actorDAO = new ActorDAO()
        return this.routes.post('/actor/update', body('actorId').notEmpty(), body('name').notEmpty().withMessage("Nome obrigatório.").custom(async (value, { req }) => {
            return new Promise((resolve, reject) => {
                if (req.body.actorId != null && req.body.actorId.length > 0) {
                    actorDAO.openByName(value).then((valueJson) => {
                        if (valueJson != null && valueJson._id != req.body.actorId) {
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
        return this.routes.post('/actor/open', body('actorId').notEmpty(), this.verifyJWT, ActorController.openById)
    }

    private create() {
        const actorDAO = new ActorDAO()
        return this.routes.post('/actor/register', body('reviewed').notEmpty(), body('name').notEmpty().withMessage("Nome obrigatório.")
            .custom(async (value) => {
                return new Promise((resolve, reject) => {
                    actorDAO.openByName(value).then((valueJson) => {
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

    private getAll() {
        return this.routes.post('/actor/open/all', body('listGeneral').notEmpty(), this.verifyJWT, ActorController.getAll)
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