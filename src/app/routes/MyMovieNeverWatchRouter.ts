import { Router } from 'express'
import jwt from 'jsonwebtoken'
import DataJsonResponse from '../core/DataJsonResponse'
import MyMovieNeverWatchController from '../../usercases/MyMovieNeverWatchController'

class MyMovieNeverWatchRouter {
    private routes: Router

    public getRoutes(routes: Router) {
        this.routes = routes
        this.create()
    }

    private create() {
        return this.routes.get('/mymovieneverwatch/register/:movieId', this.verifyJWT, MyMovieNeverWatchController.create)
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

export default new MyMovieNeverWatchRouter()