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
        return this.routes.put('/director/delete', body('directorId').notEmpty(), this.verifyJWT, DirectorController.deleteById)
    }

    private deleteById() {
        return this.routes.delete('/director/delete/:directorId', this.verifyJWT, DirectorController.deleteById)
    }

    private updateApprovedById() {
        return this.routes.get('/director/approved/:directorId', this.verifyJWT, DirectorController.updateApprovedById)
    }

    private updateById() {
        const directorDAO = new DirectorDAO()
        return this.routes.put('/director/update/:directorId', body('name')
            .notEmpty().withMessage("Nome obrigatório.").custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    if (req.params!!.directorId != null && req.params!!.directorId.length > 0) {
                        directorDAO.findByName(value).then((valueJson) => {
                            if (valueJson != null && valueJson._id != req.params!!.directorId) {
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
            }), this.verifyJWT, DirectorController.updateById)
    }

    private openById() {
        return this.routes.get('/director/open/:directorId', this.verifyJWT, DirectorController.openById)
    }

    private create() {
        const directorDAO = new DirectorDAO()
        return this.routes.post('/director/register', body('reviewed').notEmpty(),
            body('name').notEmpty().withMessage("Nome obrigatório.")
                .custom(async (value) => {
                    return new Promise((resolve, reject) => {
                        directorDAO.findByName(value).then((valueJson) => {
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
                }), this.verifyJWT, DirectorController.create)
    }

    private openAllByAuthorized() {
        return this.routes.get('/director/open/authorized', this.verifyJWT, DirectorController.openAllByAuthorized)
    }

    private openAll() {
        return this.routes.get('/director/open', this.verifyJWT, DirectorController.openAll)
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