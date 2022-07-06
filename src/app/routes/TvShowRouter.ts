import { Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import DataReturnResponse from '../core/DataReturnResponse'
import DataJsonResponse from '../core/DataJsonResponse'
import TvShowController from '../../usercases/TvShowController'
import TvShowDAO from '../../data/tvShow/TvShowDAO'

class TvShowRouter {
    private routes: Router

    public getRoutes(routes: Router) {
        this.routes = routes
        this.openAll()
        this.openTvShowDetailsAll()
        this.create()
        this.openById()
        this.updateById()
        this.updateApprovedById()
        this.deleteById()
        this.deleteAllByIds()
        this.openAllByNotMyTvShow()
    }

    private openAllByNotMyTvShow() {
        return this.routes.get('/tvshow/open/all/notmytvshow', this.verifyJWT, TvShowController.openAllByNotMyTvShow)
    }

    private deleteAllByIds() {
        return this.routes.put('/tvshow/delete', body('tvShowId').notEmpty(), this.verifyJWT, TvShowController.deleteById)
    }

    private deleteById() {
        return this.routes.delete('/tvshow/delete/:tvShowId', this.verifyJWT, TvShowController.deleteById)
    }

    private updateApprovedById() {
        return this.routes.get('/tvshow/approved/:tvShowId', this.verifyJWT, TvShowController.updateApprovedById)
    }

    private updateById() {
        const tvShowDAO = new TvShowDAO()
        return this.routes.put('/tvshow/update/:tvShowId', body('title').notEmpty()
            .withMessage("Título obrigatório.").custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    tvShowDAO.findByTitle(value).then((valueJson) => {
                        if (valueJson != null && valueJson._id != req.params!!.tvShowId) {
                            DataReturnResponse.returnReject(reject, new Error('Título já existente.'))
                        } else {
                            DataReturnResponse.returnResolve(resolve, true)
                        }
                    }).catch(err => {
                        DataReturnResponse.returnReject(reject, new Error(err.message))
                    })
                }).catch(err => {
                    throw new Error(err.message)
                })
            }), body('release').notEmpty().withMessage("Lançamento obrigatório."), this.verifyJWT,
            TvShowController.updateById)
    }

    private openById() {
        return this.routes.get('/tvshow/open/:tvShowId', this.verifyJWT, TvShowController.openById)
    }

    private create() {
        const tvShowDAO = new TvShowDAO()
        return this.routes.post('/tvshow/register', body('title').notEmpty().withMessage("Título obrigatório.")
            .custom(async (value) => {
                return new Promise((resolve, reject) => {
                    tvShowDAO.findByTitle(value).then((valueJson) => {
                        if (valueJson != null) {
                            DataReturnResponse.returnReject(reject, new Error('Título já existente.'))
                        } else {
                            DataReturnResponse.returnResolve(resolve, true)
                        }
                    }).catch(err => {
                        DataReturnResponse.returnReject(reject, new Error(err.message))
                    })
                }).catch(err => {
                    throw new Error(err.message)
                })
            }), body('release').notEmpty().withMessage("Lançamento obrigatório."), this.verifyJWT,
            TvShowController.create)
    }

    private openTvShowDetailsAll() {
        return this.routes.post('/tvshow/open/details/all', body('tvShowIds').notEmpty(),
            this.verifyJWT, TvShowController.openTvShowDetailAll)
    }

    private openAll() {
        return this.routes.get('/tvshow/open', this.verifyJWT, TvShowController.openAll)
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

export default new TvShowRouter()