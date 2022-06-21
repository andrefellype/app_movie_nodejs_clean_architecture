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
        this.getAll()
        this.create()
        this.openById()
        this.updateById()
        this.updateApprovedById()
        this.deleteById()
        this.deleteSeveralByIds()
    }

    private deleteSeveralByIds() {
        return this.routes.post('/country/delete/several', body('_ids').notEmpty(), this.verifyJWT, CountryController.deleteSeveralByIds)
    }

    private deleteById() {
        return this.routes.post('/country/delete', body('countryId').notEmpty(), this.verifyJWT, CountryController.deleteById)
    }

    private updateApprovedById() {
        return this.routes.post('/country/approved/reviewed', body('countryId').notEmpty(), this.verifyJWT, CountryController.updateApprovedById)
    }

    private updateById() {
        const countryDAO = new CountryDAO()
        return this.routes.post('/country/update', body('countryId').notEmpty(), body('name').notEmpty().withMessage("Nome obrigatório.").custom(async (value, { req }) => {
            return new Promise((resolve, reject) => {
                if (req.body.countryId != null && req.body.countryId.length > 0) {
                    countryDAO.openByName(value).then((valueJson) => {
                        if (valueJson != null && valueJson._id != req.body.countryId) {
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
        return this.routes.post('/country/open', body('countryId').notEmpty(), this.verifyJWT, CountryController.openById)
    }

    private create() {
        const countryDAO = new CountryDAO()
        return this.routes.post('/country/register', body('reviewed').notEmpty(), body('name').notEmpty().withMessage("Nome obrigatório.")
            .custom(async (value) => {
                return new Promise((resolve, reject) => {
                    countryDAO.openByName(value).then((valueJson) => {
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

    private getAll() {
        return this.routes.post('/country/open/all', body('listGeneral').notEmpty(), this.verifyJWT, CountryController.getAll)
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