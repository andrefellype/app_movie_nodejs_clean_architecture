import { Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import MyTvShowController from '../../usercases/MyTvShowController'
import DataJsonResponse from '../core/DataJsonResponse'
import DataReturnResponse from '../core/DataReturnResponse'

class MyTvShowRouter {
    private routes: Router

    public getRoutes(routes: Router) {
        this.routes = routes
        this.getAll()
        this.create()
        this.createNeverWatch()
        this.delete()
    }

    private delete() {
        return this.routes.post('/mytvshow/delete', body('tvShowId').notEmpty(), this.verifyJWT, MyTvShowController.delete)
    }

    private createNeverWatch() {
        return this.routes.post('/mytvshow/register/notwatch',
            body('typeRegister').notEmpty().withMessage("Tipo de registro obrigatório").custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    if (req.body.typeRegister.length > 0 && req.body.typeRegister == "episode" && req.body.tvShowEpisodeId.length == 0) {
                        DataReturnResponse.returnReject(reject, new Error('Episódio obrigatório'))
                    } else if (req.body.typeRegister.length > 0 && req.body.typeRegister == "season" && req.body.tvShowSeasonId.length == 0) {
                        DataReturnResponse.returnReject(reject, new Error('Temporada obrigatória'))
                    } else if (req.body.typeRegister.length > 0 && req.body.typeRegister == "tvShow" && req.body.tvShowId.length == 0) {
                        DataReturnResponse.returnReject(reject, new Error('Série obrigatória'))
                    } else {
                        DataReturnResponse.returnResolve(resolve, true)
                    }
                }).catch(err => {
                    throw new Error(err.message)
                })
            }), this.verifyJWT, MyTvShowController.createNeverWatch)
    }

    private create() {
        return this.routes.post('/mytvshow/register', body('tvShowId').notEmpty().withMessage("Série obrigatório"),
            body('tvShowSeasonId').notEmpty().withMessage("Temporada obrigatório"), body('episodes').notEmpty().withMessage("Episódios obrigatório"),
            this.verifyJWT, MyTvShowController.create)
    }

    private getAll() {
        return this.routes.post('/mytvshow/open/all', this.verifyJWT, MyTvShowController.getAll)
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

export default new MyTvShowRouter()