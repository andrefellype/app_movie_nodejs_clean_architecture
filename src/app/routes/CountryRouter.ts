import { Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import DataReturnResponse from '../core/DataReturnResponse'
import DataJsonResponse from '../core/DataJsonResponse'
import CountryDAO from '../../data/country/CountryDAO'
import CountryController from '../../usercases/CountryController'

class CountryRouter {
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
        return this.routes.put('/country/delete', body('countryId').notEmpty(), this.verifyJWT, CountryController.deleteById)
    }

    private deleteById() {
        return this.routes.delete('/country/delete/:countryId', this.verifyJWT, CountryController.deleteById)
    }

    private updateApprovedById() {
        return this.routes.get('/country/approved/:countryId', this.verifyJWT, CountryController.updateApprovedById)
    }

    private updateById() {
        const countryDAO = new CountryDAO()
        return this.routes.put('/country/update/:countryId',
            body('initial').notEmpty().withMessage("Nome obrigatório.")
                .isLength({ max: 3 }).withMessage("O nome deve ter conter no máximo 3 caracteres.")
                .custom(async (value, { req }) => {
                    return new Promise((resolve, reject) => {
                        if (req.params!!.countryId != null && req.params!!.countryId.length > 0) {
                            countryDAO.findByInitial(value).then((valueJson) => {
                                if (valueJson != null && valueJson._id != req.params!!.countryId) {
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
                }), this.verifyJWT, CountryController.updateById)
    }

    private openById() {
        return this.routes.get('/country/open/:countryId', this.verifyJWT, CountryController.openById)
    }

    private create() {
        const countryDAO = new CountryDAO()
        return this.routes.post('/country/register', body('reviewed').notEmpty(), body('initial').notEmpty().withMessage("Nome obrigatório.")
            .isLength({ max: 3 }).withMessage("O nome deve ter conter no máximo 3 caracteres.").custom(async (value) => {
                return new Promise((resolve, reject) => {
                    countryDAO.findByInitial(value).then((valueJson) => {
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
            }), this.verifyJWT, CountryController.create)
    }

    private openAllByAuthorized() {
        return this.routes.get('/country/open/authorized', this.verifyJWT, CountryController.openAllByAuthorized)
    }

    private openAll() {
        return this.routes.get('/country/open', this.verifyJWT, CountryController.openAll)
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

export default new CountryRouter()