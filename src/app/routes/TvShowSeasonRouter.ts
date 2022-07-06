import { Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import DataReturnResponse from '../core/DataReturnResponse'
import DataJsonResponse from '../core/DataJsonResponse'
import TvShowSeasonController from '../../usercases/TvShowSeasonController'
import TvShowSeasonDAO from '../../data/tvShowSeason/TvShowSeasonDAO'

class TvShowSeasonRouter {
    private routes: Router

    public getRoutes(routes: Router) {
        this.routes = routes
        this.openAll()
        this.create()
        this.openById()
        this.updateById()
        this.updateApprovedById()
        this.deleteById()
        this.deleteAllByIds()
        this.openAllByNotMyTvShow()
    }

    private openAllByNotMyTvShow() {
        return this.routes.get('/tvshowseason/open/notmytvshow/:tvShowId', this.verifyJWT, TvShowSeasonController.openAllByNotMyTvShow)
    }

    private deleteAllByIds() {
        return this.routes.put('/tvshowseason/delete', body('tvShowSeasonId').notEmpty(), this.verifyJWT,
            TvShowSeasonController.deleteById)
    }

    private deleteById() {
        return this.routes.delete('/tvshowseason/delete/:tvShowSeasonId', this.verifyJWT, TvShowSeasonController.deleteById)
    }

    private updateApprovedById() {
        return this.routes.get('/tvshowseason/approved/:tvShowSeasonId', this.verifyJWT, TvShowSeasonController.updateApprovedById)
    }

    private updateById() {
        const tvShowSeasonDAO = new TvShowSeasonDAO()
        return this.routes.put('/tvshowseason/update/:tvShowSeasonId/:tvShowId', body('name').notEmpty().withMessage("Nome obrigatório.")
            .custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    if (req.params!!.tvShowId != null && req.params!!.tvShowId.length > 0
                        && req.params!!.tvShowSeasonId != null && req.params!!.tvShowSeasonId.length > 0) {
                        tvShowSeasonDAO.findByNameAndTvShowId(req.body.name, req.params!!.tvShowId).then((valueJson) => {
                            if (valueJson != null && valueJson._id != req.params!!.tvShowSeasonId) {
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
            }), this.verifyJWT, TvShowSeasonController.updateById)
    }

    private openById() {
        return this.routes.get('/tvshowseason/open/:tvShowSeasonId', this.verifyJWT, TvShowSeasonController.openById)
    }

    private create() {
        const tvShowSeasonDAO = new TvShowSeasonDAO()
        return this.routes.post('/tvshowseason/register/:tvShowId', body('name').notEmpty().withMessage("Nome obrigatório.")
            .custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    if (req.params!!.tvShowId.length > 0) {
                        tvShowSeasonDAO.findByNameAndTvShowId(req.body.name, req.params!!.tvShowId).then((valueJson) => {
                            if (valueJson != null) {
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
            }), this.verifyJWT, TvShowSeasonController.create)
    }

    private openAll() {
        return this.routes.get('/tvshowseason/open/all/:tvShowId', this.verifyJWT, TvShowSeasonController.openAll)
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

export default new TvShowSeasonRouter()