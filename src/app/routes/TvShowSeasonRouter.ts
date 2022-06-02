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
        this.getAll()
        this.create()
        this.openById()
        this.update()
        this.approved()
        this.delete()
        this.deleteSeveral()
        this.getAllByNotMyTvShow()
    }

    private getAllByNotMyTvShow() {
        return this.routes.post('/tvshowseason/open/all/notmytvshow', body('tvShowId').notEmpty().withMessage("Série obrigatória"), this.verifyJWT, TvShowSeasonController.getAllByNotMyTvShow)
    }

    private deleteSeveral() {
        return this.routes.post('/tvshowseason/delete/several', body('_ids').notEmpty(), this.verifyJWT, TvShowSeasonController.deleteSeveral)
    }

    private delete() {
        return this.routes.post('/tvshowseason/delete', body('tvShowSeasonId').notEmpty(), this.verifyJWT, TvShowSeasonController.delete)
    }

    private approved() {
        return this.routes.post('/tvshowseason/approved/reviewed', body('tvShowSeasonId').notEmpty(), this.verifyJWT, TvShowSeasonController.approved)
    }

    private update() {
        const tvShowSeasonDAO = new TvShowSeasonDAO()
        return this.routes.post('/tvshowseason/update', body('tvShowSeasonId').notEmpty(), body('tvShowId').notEmpty(), body('name').notEmpty().withMessage("Nome obrigatório").custom(async (value, { req }) => {
            return new Promise((resolve, reject) => {
                if (req.body.tvShowId != null && req.body.tvShowId.length > 0 && req.body.tvShowSeasonId != null && req.body.tvShowSeasonId.length > 0) {
                    tvShowSeasonDAO.openByNameAndTvShowId(req.body.name, req.body.tvShowId).then((valueJson) => {
                        if (valueJson != null && valueJson._id != req.body.tvShowSeasonId) {
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
        }), this.verifyJWT, TvShowSeasonController.update)
    }

    private openById() {
        return this.routes.post('/tvshowseason/open', body('tvShowSeasonId').notEmpty(), this.verifyJWT, TvShowSeasonController.openById)
    }

    private create() {
        const tvShowSeasonDAO = new TvShowSeasonDAO()
        return this.routes.post('/tvshowseason/register', body('tvShowId').notEmpty(), body('name').notEmpty().withMessage("Nome obrigatório").custom(async (value, { req }) => {
            return new Promise((resolve, reject) => {
                if (req.body.tvShowId.length > 0) {
                    tvShowSeasonDAO.openByNameAndTvShowId(req.body.name, req.body.tvShowId).then((valueJson) => {
                        if (valueJson != null) {
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
        }), this.verifyJWT, TvShowSeasonController.create)
    }

    private getAll() {
        return this.routes.post('/tvshowseason/open/all', body('tvShowId').notEmpty().withMessage("Série obrigatória"), this.verifyJWT, TvShowSeasonController.getAll)
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