import { Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import DataReturnResponse from '../core/DataReturnResponse'
import DataJsonResponse from '../core/DataJsonResponse'
import DirectorController from '../../usercases/DirectorController'
import DirectorDAO from '../../data/director/DirectorDAO'

class DirectorRouter {
    private routes: Router

    public getRoutes(routes: Router) {
        this.routes = routes
        this.getAll()
        this.create()
        this.openById()
        this.update()
        this.approved()
        this.delete()
        this.deleteSeveral()
    }

    private deleteSeveral() {
        return this.routes.post('/director/delete/several', body('_ids').notEmpty(), this.verifyJWT, DirectorController.deleteSeveral)
    }

    private delete() {
        return this.routes.post('/director/delete', body('directorId').notEmpty(), this.verifyJWT, DirectorController.delete)
    }

    private approved() {
        return this.routes.post('/director/approved/reviewed', body('directorId').notEmpty(), this.verifyJWT, DirectorController.approved)
    }

    private update() {
        const directorDAO = new DirectorDAO()
        return this.routes.post('/director/update', body('directorId').notEmpty(), body('name').notEmpty().withMessage("Nome obrigatório").custom(async (value, { req }) => {
            return new Promise((resolve, reject) => {
                if (req.body.directorId != null && req.body.directorId.length > 0) {
                    directorDAO.openByName(value).then((valueJson) => {
                        if (valueJson != null && valueJson._id != req.body.directorId) {
                            DataReturnResponse.returnReject(reject, new Error('Nome já existente'))
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
        }), this.verifyJWT, DirectorController.update)
    }

    private openById() {
        return this.routes.post('/director/open', body('directorId').notEmpty(), this.verifyJWT, DirectorController.openById)
    }

    private create() {
        const directorDAO = new DirectorDAO()
        return this.routes.post('/director/register', body('reviewed').notEmpty(), body('name').notEmpty().withMessage("Nome obrigatório")
            .custom(async (value) => {
                return new Promise((resolve, reject) => {
                    directorDAO.openByName(value).then((valueJson) => {
                        if (valueJson != null) {
                            DataReturnResponse.returnReject(reject, new Error('Nome já existente'))
                        } else {
                            DataReturnResponse.returnResolve(resolve, true)
                        }
                    }).catch(err => {
                        DataReturnResponse.returnReject(reject, new Error(err.message))
                    })
                }).catch(err => {
                    throw new Error(err.message)
                })
            }), this.verifyJWT, DirectorController.create)
    }

    private getAll() {
        return this.routes.post('/director/open/all', body('listGeneral').notEmpty(), this.verifyJWT, DirectorController.getAll)
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

export default new DirectorRouter()