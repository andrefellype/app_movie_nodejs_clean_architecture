import { Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import DataReturnResponse from '../core/DataReturnResponse'
import DataJsonResponse from '../core/DataJsonResponse'
import UserController from '../../usercases/UserController'
import UserDAO from '../../data/user/UserDAO'

class UserRouter {
    private routes: Router

    public getRoutes(routes: Router) {
        this.routes = routes
        this.createMain()
        this.signIn()
        this.refreshToken()
        this.recoveryPassword()
        this.openByCodeRecovery()
        this.updatePasswordByCodeRecovery()
        this.openUserByToken()
        this.updateUserByToken()
        this.updatePasswordUserByToken()
        this.getAll()
        this.create()
        this.openById()
        this.updatePassword()
        this.updateEnabled()
        this.delete()
        this.deleteSeveral()
    }

    private deleteSeveral() {
        return this.routes.post('/user/delete/several', body('_ids').notEmpty(), this.verifyJWT, UserController.deleteSeveral)
    }

    private delete() {
        return this.routes.post('/user/delete', body('userId').notEmpty(), this.verifyJWT, UserController.delete)
    }

    private updateEnabled() {
        return this.routes.post('/user/update/enabled', body('userId').notEmpty(), this.verifyJWT, UserController.updateEnabled)
    }

    private updatePassword() {
        return this.routes.post('/user/update/password',
            body('userId').notEmpty(), body('password').notEmpty().withMessage("Senha obrigatória")
                .isLength({ min: 6, max: 15 }).withMessage("A senha deve ter conter no mínimo 6 caracteres e no máximo 15 caracteres"),
            body('password_confirm').notEmpty().withMessage("Confirmação de senha obrigatória").custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Confirmação não corresponde a senha')
                }
                return true
            }), this.verifyJWT, UserController.updatePassword)
    }

    private openById() {
        return this.routes.post('/user/open', body('userId').notEmpty(), this.verifyJWT, UserController.openById)
    }

    private create() {
        const userDAO = new UserDAO()
        return this.routes.post('/user/register', body('name').notEmpty().withMessage("Nome obrigatório"),
            body('birth').notEmpty().withMessage("Data de nascimento obrigatória").custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    if (req.body.birth != null && req.body.birth.length > 0) {
                        const dateEua = new Date(req.body.birth)
                        const diffDateGetTime = dateEua.getTime() - (new Date()).getTime()
                        if (isNaN(dateEua.getTime())) {
                            DataReturnResponse.returnReject(reject, new Error("Data de nascimento inválida"))
                        } else if (diffDateGetTime > -31516465212) {
                            DataReturnResponse.returnReject(reject, new Error("Data de nascimento apartir de 1 ano"))
                        } else {
                            DataReturnResponse.returnResolve(resolve, true)
                        }
                    } else {
                        DataReturnResponse.returnResolve(resolve, true)
                    }
                }).catch(err => {
                    throw new Error(err.message)
                })
            }), body('cellphone').notEmpty().withMessage("Celular obrigatório").isLength({ min: 11, max: 11 }).withMessage("Formato do celular inválido").custom(async (value) => {
                return new Promise((resolve, reject) => {
                    userDAO.openByCellphone(value).then((valueUser) => {
                        if (valueUser != null) {
                            DataReturnResponse.returnReject(reject, new Error('Celular já existente'))
                        } else {
                            DataReturnResponse.returnResolve(resolve, true)
                        }
                    }).catch(err => {
                        DataReturnResponse.returnReject(reject, new Error(err.message))
                    })
                }).catch(err => {
                    throw new Error(err.message)
                })
            }), body('password').notEmpty().withMessage("Senha obrigatória").isLength({ min: 6, max: 15 }).withMessage("A senha deve ter conter no mínimo 6 caracteres e no máximo 15 caracteres"),
            body('password_confirm').notEmpty().withMessage("Confirmação de senha obrigatória").custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Confirmação não corresponde a senha')
                }
                return true
            }), body('level').notEmpty().withMessage("Nível obrigatório"), this.verifyJWT, UserController.create)
    }

    private getAll() {
        return this.routes.post('/user/open/all', this.verifyJWT, UserController.getAll)
    }

    private updatePasswordUserByToken() {
        return this.routes.post('/user/update/password/token', body('password').notEmpty().withMessage("Senha obrigatória")
            .isLength({ min: 6, max: 15 }).withMessage("A senha deve ter conter no mínimo 6 caracteres e no máximo 15 caracteres"),
            body('password_confirm').notEmpty().withMessage("Confirmação de senha obrigatória").custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Confirmação não corresponde a senha')
                }
                return true
            }), this.verifyJWT, UserController.updatePasswordToken)
    }

    private updateUserByToken() {
        const userDAO = new UserDAO()
        return this.routes.post('/user/update/token', body('name').notEmpty().withMessage("Nome obrigatório"),
            body('birth').notEmpty().withMessage("Data de nascimento obrigatória").custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    if (req.body.birth != null && req.body.birth.length > 0) {
                        const dateEua = new Date(req.body.birth)
                        const diffDateGetTime = dateEua.getTime() - (new Date()).getTime()
                        if (isNaN(dateEua.getTime())) {
                            DataReturnResponse.returnReject(reject, new Error("Data de nascimento inválida"))
                        } else if (diffDateGetTime > -31516465212) {
                            DataReturnResponse.returnReject(reject, new Error("Data de nascimento apartir de 1 ano"))
                        } else {
                            DataReturnResponse.returnResolve(resolve, true)
                        }
                    } else {
                        DataReturnResponse.returnResolve(resolve, true)
                    }
                }).catch(err => {
                    throw new Error(err.message)
                })
            }), body('cellphone').notEmpty().withMessage("Celular obrigatório").isLength({ min: 11, max: 11 }).withMessage("Formato do celular inválido").custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    if (typeof req.headers['x-access-token'] != "undefined" && req.headers['x-access-token'] != null) {
                        let userToken = null
                        const token = req.headers['x-access-token']
                        jwt.verify(token, "appmovie", (err, decoded) => {
                            if (err) {
                                DataReturnResponse.returnReject(reject, new Error("token_invalidate"))
                            } else {
                                userToken = decoded.userAuth
                            }
                        })
                        if (userToken != null) {
                            userDAO.openByCellphone(value).then((valueUser) => {
                                if (valueUser != null && valueUser._id != userToken._id) {
                                    DataReturnResponse.returnReject(reject, new Error('Celular já existente'))
                                } else {
                                    DataReturnResponse.returnResolve(resolve, true)
                                }
                            }).catch(err => {
                                DataReturnResponse.returnReject(reject, new Error(err.message))
                            })
                        } else {
                            DataReturnResponse.returnReject(reject, new Error("token_invalidate"))
                        }
                    }
                }).catch(err => {
                    throw new Error(err.message)
                })
            }), this.verifyJWT, UserController.updateToken)
    }

    private openUserByToken() {
        return this.routes.get('/user/open/token', this.verifyJWT, UserController.openUserByToken)
    }

    private updatePasswordByCodeRecovery() {
        return this.routes.post('/user/update/password/coderecovery',
            body('code').notEmpty().withMessage("Código obrigatório"),
            body('password').notEmpty().withMessage("Senha obrigatória")
                .isLength({ min: 6, max: 15 }).withMessage("A senha deve ter conter no mínimo 6 caracteres e no máximo 15 caracteres"),
            body('password_confirm').notEmpty().withMessage("Confirmação de senha obrigatória").custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Confirmação não corresponde a senha')
                }
                return true
            }), UserController.updatePasswordByCodeRecovery)
    }

    private openByCodeRecovery() {
        return this.routes.post('/user/open/coderecovery', body('code').notEmpty().withMessage("Código obrigatório"), UserController.openByCodeRecovery)
    }

    private recoveryPassword() {
        return this.routes.post('/user/recovery/password', body('cellphone').notEmpty().withMessage("Celular obrigatório"), UserController.recoveryPassword)
    }

    private refreshToken() {
        return this.routes.post('/user/refresh/token', this.verifyJWT, UserController.refreshToken)
    }

    private signIn() {
        return this.routes.post('/user/signin',
            body('cellphone').notEmpty().withMessage("Celular obrigatório"),
            body('password').notEmpty().withMessage("Senha obrigatória"), UserController.signIn)
    }

    private createMain() {
        const userDAO = new UserDAO()
        return this.routes.post('/user/register/main', body('name').notEmpty().withMessage("Nome obrigatório"),
            body('birth').notEmpty().withMessage("Data de nascimento obrigatória").custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    if (req.body.birth != null && req.body.birth.length > 0) {
                        const dateEua = new Date(req.body.birth)
                        const diffDateGetTime = dateEua.getTime() - (new Date()).getTime()
                        if (isNaN(dateEua.getTime())) {
                            DataReturnResponse.returnReject(reject, new Error("Data de nascimento inválida"))
                        } else if (diffDateGetTime > -31516465212) {
                            DataReturnResponse.returnReject(reject, new Error("Data de nascimento apartir de 1 ano"))
                        } else {
                            DataReturnResponse.returnResolve(resolve, true)
                        }
                    } else {
                        DataReturnResponse.returnResolve(resolve, true)
                    }
                }).catch(err => {
                    throw new Error(err.message)
                })
            }), body('cellphone').notEmpty().withMessage("Celular obrigatório").isLength({ min: 11, max: 11 }).withMessage("Formato do celular inválido").custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    userDAO.openByCellphone(value).then((valueUser) => {
                        if (valueUser != null) {
                            DataReturnResponse.returnReject(reject, new Error('Celular já existente'))
                        } else {
                            DataReturnResponse.returnResolve(resolve, true)
                        }
                    }).catch(err => {
                        DataReturnResponse.returnReject(reject, new Error(err.message))
                    })
                }).catch(err => {
                    throw new Error(err.message)
                })
            }), body('password').notEmpty().withMessage("Senha obrigatória").isLength({ min: 6, max: 15 }).withMessage("A senha deve ter conter no mínimo 6 caracteres e no máximo 15 caracteres"),
            body('password_confirm').notEmpty().withMessage("Confirmação de senha obrigatória").custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Confirmação não corresponde a senha')
                }
                return true
            }), UserController.createMain)
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

export default new UserRouter()