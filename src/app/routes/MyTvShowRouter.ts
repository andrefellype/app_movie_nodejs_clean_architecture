import { Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import MyTvShowController from '../../usercases/MyTvShowEpisodeController'
import DataJsonResponse from '../core/DataJsonResponse'

class MyTvShowRouter {
    private routes: Router

    public getRoutes(routes: Router) {
        this.routes = routes
        this.openAll()
        this.create()
        this.deleteById()
    }

    private deleteById() {
        return this.routes.delete('/mytvshow/delete/:tvShowId', this.verifyJWT, MyTvShowController.deleteById)
    }

    private create() {
        return this.routes.post('/mytvshow/register/:tvShowId/:tvShowSeasonId', body('episodes').notEmpty().withMessage("Episódios obrigatório."),
            this.verifyJWT, MyTvShowController.create)
    }

    private openAll() {
        return this.routes.get('/mytvshow/open', this.verifyJWT, MyTvShowController.openAll)
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