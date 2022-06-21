import { Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import DataReturnResponse from '../core/DataReturnResponse'
import DataJsonResponse from '../core/DataJsonResponse'
import TvShowEpisodeController from '../../usercases/TvShowEpisodeController'
import TvShowEpisodeDAO from '../../data/tvShowEpisode/TvShowEpisodeDAO'

class TvShowEpisodeRouter {
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
        this.getAllByNotMyTvShow()
    }

    private getAllByNotMyTvShow() {
        return this.routes.post('/tvshowepisode/open/all/notmytvshow', body('tvShowSeasonId').notEmpty().withMessage("Temporada obrigatória."), this.verifyJWT, TvShowEpisodeController.getAllByNotMyTvShow)
    }

    private deleteSeveralByIds() {
        return this.routes.post('/tvshowepisode/delete/several', body('_ids').notEmpty(), this.verifyJWT, TvShowEpisodeController.deleteSeveralByIds)
    }

    private deleteById() {
        return this.routes.post('/tvshowepisode/delete', body('tvShowEpisodeId').notEmpty(), this.verifyJWT, TvShowEpisodeController.deleteById)
    }

    private updateApprovedById() {
        return this.routes.post('/tvshowepisode/approved/reviewed', body('tvShowEpisodeId').notEmpty(), this.verifyJWT, TvShowEpisodeController.updateApprovedById)
    }

    private updateById() {
        const tvShowEpisodeDAO = new TvShowEpisodeDAO()
        return this.routes.post('/tvshowepisode/update', body('tvShowEpisodeId').notEmpty(), body('tvShowSeasonId').notEmpty(),
            body('name').notEmpty().withMessage("Nome obrigatório.").custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    if (req.body.tvShowSeasonId != null && req.body.tvShowSeasonId.length > 0 && req.body.tvShowEpisodeId != null && req.body.tvShowEpisodeId.length > 0) {
                        tvShowEpisodeDAO.openByNameAndTvShowSeasonId(req.body.name, req.body.tvShowSeasonId).then((valueJson) => {
                            if (valueJson != null && valueJson._id != req.body.tvShowEpisodeId) {
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
            }), this.verifyJWT, TvShowEpisodeController.updateById)
    }

    private openById() {
        return this.routes.post('/tvshowepisode/open', body('tvShowEpisodeId').notEmpty(), this.verifyJWT, TvShowEpisodeController.openById)
    }

    private create() {
        const tvShowEpisodeDAO = new TvShowEpisodeDAO()
        return this.routes.post('/tvshowepisode/register', body('tvShowSeasonId').notEmpty(), body('name').notEmpty().withMessage("Nome obrigatório.").custom(async (value, { req }) => {
            return new Promise((resolve, reject) => {
                if (req.body.tvShowSeasonId.length > 0) {
                    tvShowEpisodeDAO.openByNameAndTvShowSeasonId(req.body.name, req.body.tvShowSeasonId).then((valueJson) => {
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
        }), this.verifyJWT, TvShowEpisodeController.create)
    }

    private getAll() {
        return this.routes.post('/tvshowepisode/open/all', body('tvShowSeasonId').notEmpty().withMessage("Temporada obrigatória."), this.verifyJWT, TvShowEpisodeController.getAll)
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

export default new TvShowEpisodeRouter()