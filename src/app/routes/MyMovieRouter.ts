import { Router } from 'express'
import jwt from 'jsonwebtoken'
import DataJsonResponse from '../core/DataJsonResponse'
import MyMovieController from '../../usercases/MyMovieController'

class MyMovieRouter {
    private routes: Router

    public getRoutes(routes: Router) {
        this.routes = routes
        this.openAll()
        this.create()
        this.deleteById()
    }

    private deleteById() {
        return this.routes.delete('/mymovie/delete/:movieId', this.verifyJWT, MyMovieController.deleteById)
    }

    private create() {
        return this.routes.get('/mymovie/register/:movieId', this.verifyJWT, MyMovieController.create)
    }

    private openAll() {
        return this.routes.get('/mymovie/open', this.verifyJWT, MyMovieController.openAll)
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

export default new MyMovieRouter()