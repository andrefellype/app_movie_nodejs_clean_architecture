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
        return this.routes.post('/tvshow/open/all/notmytvshow', this.verifyJWT, TvShowController.getAllByNotMyTvShow)
    }

    private deleteSeveral() {
        return this.routes.post('/tvshow/delete/several', body('_ids').notEmpty(), this.verifyJWT, TvShowController.deleteSeveral)
    }

    private delete() {
        return this.routes.post('/tvshow/delete', body('tvShowId').notEmpty(), this.verifyJWT, TvShowController.delete)
    }

    private approved() {
        return this.routes.post('/tvshow/approved/reviewed', body('tvShowId').notEmpty(), this.verifyJWT, TvShowController.approved)
    }

    private update() {
        const tvShowDAO = new TvShowDAO()
        return this.routes.post('/tvshow/update', body('tvShowId').notEmpty(), body('title').notEmpty().withMessage("Título obrigatório")
            .custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    tvShowDAO.openByTitle(value).then((valueJson) => {
                        if (valueJson != null && valueJson._id != req.body.tvShowId) {
                            DataReturnResponse.returnReject(reject, new Error('Título já existente'))
                        } else {
                            DataReturnResponse.returnResolve(resolve, true)
                        }
                    }).catch(err => {
                        DataReturnResponse.returnReject(reject, new Error(err.message))
                    })
                }).catch(err => {
                    throw new Error(err.message)
                })
            }), body('release').notEmpty().withMessage("Lançamento obrigatório"), this.verifyJWT, TvShowController.update)
    }

    private openById() {
        return this.routes.post('/tvshow/open', body('tvShowId').notEmpty(), this.verifyJWT, TvShowController.openById)
    }

    private create() {
        const tvShowDAO = new TvShowDAO()
        return this.routes.post('/tvshow/register', body('title').notEmpty().withMessage("Título obrigatório")
            .custom(async (value) => {
                return new Promise((resolve, reject) => {
                    tvShowDAO.openByTitle(value).then((valueJson) => {
                        if (valueJson != null) {
                            DataReturnResponse.returnReject(reject, new Error('Título já existente'))
                        } else {
                            DataReturnResponse.returnResolve(resolve, true)
                        }
                    }).catch(err => {
                        DataReturnResponse.returnReject(reject, new Error(err.message))
                    })
                }).catch(err => {
                    throw new Error(err.message)
                })
            }), body('release').notEmpty().withMessage("Lançamento obrigatório"), this.verifyJWT, TvShowController.create)
    }

    private getAll() {
        return this.routes.post('/tvshow/open/all', this.verifyJWT, TvShowController.getAll)
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