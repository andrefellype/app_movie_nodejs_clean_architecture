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
        this.openAll()
        this.create()
        this.openById()
        this.updateById()
        this.deleteById()
        this.deleteAllByIds()
    }

    private deleteAllByIds() {
        return this.routes.put('/category/delete', body('categoryId').notEmpty(), this.verifyJWT, CategoryController.deleteById)
    }

    private deleteById() {
        return this.routes.delete('/category/delete/:categoryId', this.verifyJWT, CategoryController.deleteById)
    }

    private updateById() {
        const categoryDAO = new CategoryDAO()
        return this.routes.put('/category/update/:categoryId', body('name').notEmpty()
            .withMessage("Nome obrigatório.").custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    if (req.params!!.categoryId != null && req.params!!.categoryId.length > 0) {
                        categoryDAO.findByName(value).then((valueJson) => {
                            if (valueJson != null && valueJson._id != req.params!!.categoryId) {
                                DataReturnResponse.returnReject(reject, new Error('Nome já existente.'))
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
            }), this.verifyJWT, CategoryController.updateById)
    }

    private openById() {
        return this.routes.get('/category/open/:categoryId', this.verifyJWT, CategoryController.openById)
    }

    private create() {
        const categoryDAO = new CategoryDAO()
        return this.routes.post('/category/register', body('name').notEmpty()
            .withMessage("Nome obrigatório.").custom(async (value) => {
                return new Promise((resolve, reject) => {
                    categoryDAO.findByName(value).then((valueJson) => {
                        if (valueJson != null) {
                            DataReturnResponse.returnReject(reject, new Error('Nome já existente.'))
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

    private openAll() {
        return this.routes.get('/category/open', this.verifyJWT, CategoryController.openAll)
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