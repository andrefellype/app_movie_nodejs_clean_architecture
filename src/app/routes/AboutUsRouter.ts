import { Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import AboutUsController from '../../usercases/AboutUsController'
import DataJsonResponse from '../core/DataJsonResponse'

class AboutUsRouter {
    private routes: Router

    public getRoutes(routes: Router) {
        this.routes = routes
        this.openLast()
        this.create()
        this.updateAll()
        this.deleteAll()
    }

    private deleteAll() {
        return this.routes.delete('/aboutus/delete', this.verifyJWT, AboutUsController.deleteAll)
    }

    private updateAll() {
        return this.routes.put('/aboutus/update',
            body('app').notEmpty().withMessage("App obrigatório."),
            body('web').notEmpty().withMessage("Web obrigatório."), this.verifyJWT, AboutUsController.updateAll)
    }

    private create() {
        return this.routes.post('/aboutus/register',
            body('app').notEmpty().withMessage("App obrigatório."),
            body('web').notEmpty().withMessage("Web obrigatório."), this.verifyJWT, AboutUsController.create)
    }

    private openLast() {
        return this.routes.get('/aboutus', AboutUsController.openLast)
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

export default new AboutUsRouter()