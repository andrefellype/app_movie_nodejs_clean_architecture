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
        return this.routes.get('/tvshowepisode/open/notmytvshow/:tvShowSeasonId', this.verifyJWT, TvShowEpisodeController.openAllByNotMyTvShow)
    }

    private deleteAllByIds() {
        return this.routes.put('/tvshowepisode/delete', body('tvShowEpisodeId').notEmpty(), this.verifyJWT, TvShowEpisodeController.deleteById)
    }

    private deleteById() {
        return this.routes.delete('/tvshowepisode/delete/:tvShowEpisodeId', this.verifyJWT, TvShowEpisodeController.deleteById)
    }

    private updateApprovedById() {
        return this.routes.get('/tvshowepisode/approved/:tvShowEpisodeId', this.verifyJWT, TvShowEpisodeController.updateApprovedById)
    }

    private updateById() {
        const tvShowEpisodeDAO = new TvShowEpisodeDAO()
        return this.routes.put('/tvshowepisode/update/:tvShowEpisodeId/:tvShowSeasonId',
            body('name').notEmpty().withMessage("Nome obrigatório.").custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    if (req.params!!.tvShowSeasonId != null && req.params!!.tvShowSeasonId.length > 0
                        && req.params!!.tvShowEpisodeId != null && req.params!!.tvShowEpisodeId.length > 0) {
                        tvShowEpisodeDAO.findByNameAndTvShowSeasonId(req.body.name, req.params!!.tvShowSeasonId).then((valueJson) => {
                            if (valueJson != null && valueJson._id != req.params!!.tvShowEpisodeId) {
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
        return this.routes.get('/tvshowepisode/open/:tvShowEpisodeId', this.verifyJWT, TvShowEpisodeController.openById)
    }

    private create() {
        const tvShowEpisodeDAO = new TvShowEpisodeDAO()
        return this.routes.post('/tvshowepisode/register/:tvShowSeasonId', body('name').notEmpty().withMessage("Nome obrigatório.")
            .custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    if (req.params!!.tvShowSeasonId.length > 0) {
                        tvShowEpisodeDAO.findByNameAndTvShowSeasonId(req.body.name, req.params!!.tvShowSeasonId).then((valueJson) => {
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

    private openAll() {
        return this.routes.get('/tvshowepisode/open/all/:tvShowSeasonId', this.verifyJWT, TvShowEpisodeController.openAll)
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