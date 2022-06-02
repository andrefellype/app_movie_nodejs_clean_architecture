import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import sha1 from 'sha1'
import jwt from 'jsonwebtoken'
import UserDAO from "../data/user/UserDAO"
import { UserGetObjectForJson } from "../domain/entity/user/UserConst"
import { ObjectId } from 'mongodb'

class UserController {
    private static async deleteUser(idsUser: string[], userDAO: UserDAO) {
        const ids = idsUser.map(i => new ObjectId(i))
        await userDAO.updateByWhere({ status: false, "updated_at": ConvertData.getDateNowStr() }, { _id: { $in: ids } })
    }

    public deleteSeveral(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const ids = JSON.parse(req.body._ids).map(id => new ObjectId(id))
                await UserController.deleteUser(ids, (new UserDAO()))
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public delete(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                await UserController.deleteUser([req.body.userId], (new UserDAO()))
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public updateEnabled(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const userDAO = new UserDAO()
                userDAO.open(req.body.userId).then(valueUser => {
                    userDAO.updateByWhere({ enabled: !valueUser.enabled, "updated_at": ConvertData.getDateNowStr() }, { _id: new ObjectId(req.body.userId) })
                        .then(valueUpdate => {
                            DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                        }).catch(err => console.log(err))
                })
            }
        })
    }

    public updatePassword(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const userDAO = new UserDAO()
                userDAO.updateByWhere({
                    password: sha1(req.body.password),
                    updated_at: ConvertData.getDateNowStr()
                }, { _id: new ObjectId(req.body.userId) }).then(async valueUpdate => {
                    userDAO.open(req.userAuth._id).then((value) => {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                    })
                }).catch(err => console.log(err))
            }
        })
    }

    public openById(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const userDAO = new UserDAO()
                userDAO.open(req.body.userId).then(async valueUser => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, UserGetObjectForJson(valueUser)))
                }).catch(err => console.log(err))
            }
        })
    }

    public create(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const userDAO = new UserDAO()
                userDAO.create(req.body.name, req.body.birth, req.body.email, req.body.cellphone, sha1(req.body.password), req.body.level, ConvertData.getDateNowStr()).then(async valueId => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueId))
                }).catch(err => console.log(err))
            }
        })
    }

    public getAll(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const userDAO = new UserDAO()
            userDAO.allByNotIdAndStatus(req.userAuth._id).then(async valuesJson => {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, valuesJson))
            }).catch(err => console.log(err))
        })
    }

    public updatePasswordToken(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const userDAO = new UserDAO()
                userDAO.updateByWhere({
                    password: sha1(req.body.password),
                    updated_at: ConvertData.getDateNowStr()
                }, { _id: new ObjectId(req.userAuth._id) }).then(async valueUpdate => {
                    userDAO.open(req.userAuth._id).then((value) => {
                        const token = jwt.sign({ userAuth: value }, "appmovie", { expiresIn: 43200 })
                        const userData = UserGetObjectForJson(value, token)
                        req.session.user = userData
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, userData))
                    })
                }).catch(err => console.log(err))
            }
        })
    }

    public updateToken(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const userDAO = new UserDAO()
                userDAO.open(req.userAuth._id).then(valueUserJ => {
                    userDAO.updateByWhere({
                        name: req.body.name,
                        birth: req.body.birth,
                        email: req.body.email,
                        cellphone: req.body.cellphone,
                        updated_at: ConvertData.getDateNowStr()
                    }, { _id: new ObjectId(req.userAuth._id) }).then(async valueUpdate => {
                        userDAO.open(req.userAuth._id).then((value) => {
                            const token = jwt.sign({ userAuth: value }, "appmovie", { expiresIn: 43200 })
                            const userData = UserGetObjectForJson(value, token)
                            req.session.user = userData
                            DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, userData))
                        })
                    }).catch(err => console.log(err))

                })
            }
        })
    }

    public openUserByToken(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const userDAO = new UserDAO()
                userDAO.open(req.userAuth._id).then(async valueUser => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, UserGetObjectForJson(valueUser)))
                }).catch(err => console.log(err))
            }
        })
    }

    public updatePasswordByCodeRecovery(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const userDAO = new UserDAO()
                userDAO.openByCodeRecovery(req.body.code).then(valueUser => {
                    if (valueUser == null) {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, [{ msg: "Código não consta em nosso registro" }]))
                    } else {
                        userDAO.updateByWhere({
                            password: sha1(req.body.password),
                            code_recovery: null,
                            updated_at: ConvertData.getDateNowStr()
                        }, { _id: new ObjectId(valueUser._id) }).then(value => {
                            userDAO.open(valueUser._id).then(valueOpen => {
                                let userData = valueOpen
                                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, userData))
                            })
                        })
                    }
                }).catch(err => console.log(err))
            }
        })
    }

    public openByCodeRecovery(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const userDAO = new UserDAO()
                userDAO.openByCodeRecovery(req.body.code).then(valueUser => {
                    if (valueUser == null) {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, [{ msg: "Código não consta em nosso registro" }]))
                    } else {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueUser))
                    }
                }).catch(err => console.log(err))
            }
        })
    }

    public recoveryPassword(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                if (true) {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, [{ msg: 'EM MANUTENÇÃO' }]))
                } else {
                    const userDAO = new UserDAO()
                    userDAO.openByCellphone(req.body.cellphone).then(valueUser => {
                        if (valueUser == null) {
                            DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, [{ msg: "Celular não consta em nosso registro" }]))
                        } else {
                            let numberRandom = ""
                            for (let x = 0; x < 10; x++) {
                                numberRandom += Math.floor(Math.random() * (10 - 0) + 0)
                            }

                            let codeRecovery = `${valueUser._id}_${numberRandom}_${valueUser.level}_`
                            codeRecovery += `${ConvertData.getDateObject().year}${ConvertData.getDateObject().month}${ConvertData.getDateObject().day}`
                            codeRecovery += `${ConvertData.getDateObject().hour}${ConvertData.getDateObject().minutes}${ConvertData.getDateObject().seconds}`

                            userDAO.updateByWhere({ code_recovery: codeRecovery }, { _id: new ObjectId(valueUser._id) }).then(value => {
                                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                            })
                        }
                    }).catch(err => console.log(err))
                }
            }
        })
    }

    public refreshToken(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const userDAO = new UserDAO()
            userDAO.open(req.userAuth._id).then((value) => {
                if (value !== null) {
                    const token = jwt.sign({ userAuth: value }, "appmovie", { expiresIn: 43200 })
                    const userData = UserGetObjectForJson(value, token)
                    req.session.user = userData
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, userData))
                } else {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, [{ msg: "Token inválido" }]))
                }
            })
        })
    }

    public signIn(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const userDAO = new UserDAO()
                userDAO.openByCellphoneAndPassword(req.body.cellphone, sha1(req.body.password)).then(valueUser => {
                    if (valueUser == null) {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, [{ msg: "Dados inválidos" }]))
                    } else {
                        if (!valueUser.enabled) {
                            DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, [{ msg: "Usuário bloqueado" }]))
                        } else {
                            userDAO.updateByWhere({ last_access_at: ConvertData.getDateNowStr() }, { _id: new ObjectId(valueUser._id) }).then(valueUpdate => {
                                userDAO.open(valueUser._id).then(valueOpen => {
                                    const token = jwt.sign({ userAuth: valueOpen }, "appmovie", { expiresIn: 43200 })
                                    const userData = UserGetObjectForJson(valueOpen, token)
                                    req.session.user = userData
                                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, userData))
                                })
                            })
                        }
                    }
                }).catch(err => console.log(err))
            }
        })
    }

    public createMain(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const userDAO = new UserDAO()
                userDAO.getAll().then(async valuesUser => {
                    const level = valuesUser.length > 0 ? "COMMON" : "ADMIN"
                    const dateNow = ConvertData.getDateNowStr()
                    userDAO.create(req.body.name, req.body.birth, req.body.email, req.body.cellphone, sha1(req.body.password), level, dateNow, null, dateNow).then(async valueId => {
                        userDAO.open(valueId.toString()).then((value) => {
                            const token = jwt.sign({ userAuth: value }, "appmovie", { expiresIn: 43200 })
                            const userData = UserGetObjectForJson(value, token)
                            req.session.user = userData
                            DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, userData))
                        })
                    }).catch(err => console.log(err))
                })
            }
        })
    }
}

export default new UserController()