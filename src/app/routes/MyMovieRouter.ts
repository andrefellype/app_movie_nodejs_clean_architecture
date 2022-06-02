import { Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import DataJsonResponse from '../core/DataJsonResponse'
import MyMovieController from '../../usercases/MyMovieController'

class MyMovieRouter {
    private routes: Router

    public getRoutes(routes: Router) {
        this.routes = routes
        this.getAll()
        this.create()
        this.createNeverWatch()
        this.delete()
    }

    private delete() {
        return this.routes.post('/mymovie/delete', body('movieId').notEmpty(), this.verifyJWT, MyMovieController.delete)
    }

    private createNeverWatch() {
        return this.routes.post('/mymovie/register/notwatch', body('movieId').notEmpty().withMessage("Filme obrigatório"), this.verifyJWT, MyMovieController.createNeverWatch)
    }

    private create() {
        return this.routes.post('/mymovie/register', body('movieId').notEmpty().withMessage("Filme obrigatório"), this.verifyJWT, MyMovieController.create)
    }

    private getAll() {
        return this.routes.post('/mymovie/open/all', this.verifyJWT, MyMovieController.getAll)
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