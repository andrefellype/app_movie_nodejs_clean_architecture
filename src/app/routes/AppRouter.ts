import { Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import AppController from '../../usercases/AppController'
import DataJsonResponse from '../core/DataJsonResponse'

class AppRouter {
    private routes: Router

    public getRoutes(routes: Router) {
        this.routes = routes
        this.showAboutUs()
        this.createAboutUs()
        this.updateAboutUs()
        this.deleteAboutUs()
    }

    private deleteAboutUs() {
        return this.routes.post('/app/aboutus/delete', this.verifyJWT, AppController.deleteAboutUs)
    }

    private updateAboutUs() {
        return this.routes.post('/app/aboutus/update',
            body('app').notEmpty().withMessage("App obrigatório"),
            body('web').notEmpty().withMessage("Web obrigatório"), this.verifyJWT, AppController.updateAboutUs)
    }

    private createAboutUs() {
        return this.routes.post('/app/aboutus/register',
            body('app').notEmpty().withMessage("App obrigatório"),
            body('web').notEmpty().withMessage("Web obrigatório"), this.verifyJWT, AppController.createAboutUs)
    }

    private showAboutUs() {
        return this.routes.get('/app/aboutus', AppController.showAboutUs)
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

export default new AppRouter()