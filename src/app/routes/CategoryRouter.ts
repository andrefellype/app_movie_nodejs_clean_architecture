import { Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import DataReturnResponse from '../core/DataReturnResponse'
import DataJsonResponse from '../core/DataJsonResponse'
import CategoryController from '../../usercases/CategoryController'
import CategoryDAO from '../../data/category/CategoryDAO'

class CategoryRouter {
    private routes: Router

    public getRoutes(routes: Router) {
        this.routes = routes
        this.getAll()
        this.create()
        this.openById()
        this.update()
        this.delete()
        this.deleteSeveral()
    }

    private deleteSeveral() {
        return this.routes.post('/category/delete/several', body('_ids').notEmpty(), this.verifyJWT, CategoryController.deleteSeveral)
    }

    private delete() {
        return this.routes.post('/category/delete', body('categoryId').notEmpty(), this.verifyJWT, CategoryController.delete)
    }

    private update() {
        const categoryDAO = new CategoryDAO()
        return this.routes.post('/category/update', body('categoryId').notEmpty(), body('name').notEmpty().withMessage("Nome obrigatório").custom(async (value, { req }) => {
            return new Promise((resolve, reject) => {
                if (req.body.categoryId != null && req.body.categoryId.length > 0) {
                    categoryDAO.openByName(value).then((valueJson) => {
                        if (valueJson != null && valueJson._id != req.body.categoryId) {
                            DataReturnResponse.returnReject(reject, new Error('Nome já existente'))
                        } else {
                            DataReturnResponse.returnResolve(resolve, true)
                        }
                    }).catch(err => {
                        DataReturnResponse.returnReject(reject, new Error(err.message))
                    })
                } else {
                    DataReturnResponse.returnResolve(resolve, true)
                }
            }).catch(err => {
                throw new Error(err.message)
            })
        }), this.verifyJWT, CategoryController.update)
    }

    private openById() {
        return this.routes.post('/category/open', body('categoryId').notEmpty(), this.verifyJWT, CategoryController.openById)
    }

    private create() {
        const categoryDAO = new CategoryDAO()
        return this.routes.post('/category/register', body('name').notEmpty().withMessage("Nome obrigatório").custom(async (value) => {
            return new Promise((resolve, reject) => {
                categoryDAO.openByName(value).then((valueJson) => {
                    if (valueJson != null) {
                        DataReturnResponse.returnReject(reject, new Error('Nome já existente'))
                    } else {
                        DataReturnResponse.returnResolve(resolve, true)
                    }
                }).catch(err => {
                    DataReturnResponse.returnReject(reject, new Error(err.message))
                })
            }).catch(err => {
                throw new Error(err.message)
            })
        }), this.verifyJWT, CategoryController.create)
    }

    private getAll() {
        return this.routes.post('/category/open/all', this.verifyJWT, CategoryController.getAll)
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

export default new CategoryRouter()