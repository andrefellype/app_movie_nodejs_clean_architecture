import { Router } from 'express'
import jwt from 'jsonwebtoken'
import MyTvShowSeasonNeverWatchController from '../../usercases/MyTvShowSeasonNeverWatchController'
import DataJsonResponse from '../core/DataJsonResponse'

class MyTvShowSeasonNeverWatchRouter {
    private routes: Router

    public getRoutes(routes: Router) {
        this.routes = routes
        this.create()
    }

    private create() {
        return this.routes.get('/mytvshowseasonneverwatch/register/:tvShowId/:tvShowSeasonId',
            this.verifyJWT, MyTvShowSeasonNeverWatchController.create)
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

export default new MyTvShowSeasonNeverWatchRouter()