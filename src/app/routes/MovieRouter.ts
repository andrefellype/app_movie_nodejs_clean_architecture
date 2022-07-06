import { Router } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import DataReturnResponse from '../core/DataReturnResponse'
import DataJsonResponse from '../core/DataJsonResponse'
import MovieDAO from '../../data/movie/MovieDAO'
import MovieController from '../../usercases/MovieController'

class MovieRouter {
    private routes: Router

    public getRoutes(routes: Router) {
        this.routes = routes
        this.openAll()
        this.openMovieDetailAll()
        this.create()
        this.openById()
        this.updateById()
        this.updateApprovedById()
        this.deleteById()
        this.deleteAllByIds()
        this.openAllByNotMyMovie()
    }

    private openAllByNotMyMovie() {
        return this.routes.get('/movie/notmymovie/open', this.verifyJWT, MovieController.openAllByNotMyMovie)
    }

    private deleteAllByIds() {
        return this.routes.put('/movie/delete', body('movieId').notEmpty(), this.verifyJWT, MovieController.deleteById)
    }

    private deleteById() {
        return this.routes.delete('/movie/delete/:movieId', this.verifyJWT, MovieController.deleteById)
    }

    private updateApprovedById() {
        return this.routes.get('/movie/approved/:movieId', this.verifyJWT, MovieController.updateApprovedById)
    }

    private updateById() {
        const movieDAO = new MovieDAO()
        return this.routes.put('/movie/update/:movieId', body('title').notEmpty().withMessage("Título obrigatório.")
            .custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    movieDAO.findByTitle(value).then((valueJson) => {
                        if (valueJson != null && valueJson._id != req.params!!.movieId) {
                            DataReturnResponse.returnReject(reject, new Error('Título já existente.'))
                        } else {
                            DataReturnResponse.returnResolve(resolve, true)
                        }
                    }).catch(err => {
                        DataReturnResponse.returnReject(reject, new Error(err.message))
                    })
                }).catch(err => {
                    throw new Error(err.message)
                })
            }), body('release').notEmpty().withMessage("Lançamento obrigatório."),
            body('duration').notEmpty().withMessage("Duração obrigatória.").custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    let hourStr = ""
                    let minuteStr = ""
                    for (let d = 0; d < req.body.duration.length; d++) {
                        if (!isNaN(parseInt(req.body.duration[d])) && hourStr.length < 2) {
                            hourStr += req.body.duration[d].toString()
                        } else if (!isNaN(parseInt(req.body.duration[d])) && hourStr.length == 2) {
                            minuteStr += req.body.duration[d].toString()
                        }
                    }
                    if ((parseInt(minuteStr) < 0 || parseInt(minuteStr) > 59) || `${hourStr}:${minuteStr}`.length != 5) {
                        DataReturnResponse.returnReject(reject, new Error("Duração inválida."))
                    } else {
                        DataReturnResponse.returnResolve(resolve, true)
                    }
                }).catch(err => {
                    throw new Error(err.message)
                })
            }), body('movieTheater').notEmpty().withMessage("Cinema obrigatório."), this.verifyJWT, MovieController.updateById)
    }

    private openById() {
        return this.routes.get('/movie/open/:movieId', this.verifyJWT, MovieController.openById)
    }

    private create() {
        const movieDAO = new MovieDAO()
        return this.routes.post('/movie/register', body('title').notEmpty().withMessage("Título obrigatório.")
            .custom(async (value) => {
                return new Promise((resolve, reject) => {
                    movieDAO.findByTitle(value).then((valueJson) => {
                        if (valueJson != null) {
                            DataReturnResponse.returnReject(reject, new Error('Título já existente.'))
                        } else {
                            DataReturnResponse.returnResolve(resolve, true)
                        }
                    }).catch(err => {
                        DataReturnResponse.returnReject(reject, new Error(err.message))
                    })
                }).catch(err => {
                    throw new Error(err.message)
                })
            }), body('release').notEmpty().withMessage("Lançamento obrigatório."),
            body('duration').notEmpty().withMessage("Duração obrigatória.").custom(async (value, { req }) => {
                return new Promise((resolve, reject) => {
                    let hourStr = ""
                    let minuteStr = ""
                    for (let d = 0; d < req.body.duration.length; d++) {
                        if (!isNaN(parseInt(req.body.duration[d])) && hourStr.length < 2) {
                            hourStr += req.body.duration[d].toString()
                        } else if (!isNaN(parseInt(req.body.duration[d])) && hourStr.length == 2) {
                            minuteStr += req.body.duration[d].toString()
                        }
                    }
                    if ((parseInt(minuteStr) < 0 || parseInt(minuteStr) > 59) || `${hourStr}:${minuteStr}`.length != 5) {
                        DataReturnResponse.returnReject(reject, new Error("Duração inválida."))
                    } else {
                        DataReturnResponse.returnResolve(resolve, true)
                    }
                }).catch(err => {
                    throw new Error(err.message)
                })
            }), body('movieTheater').notEmpty().withMessage("Cinema obrigatório."), this.verifyJWT, MovieController.create)
    }

    private openMovieDetailAll() {
        return this.routes.post('/movie/open/details/all', body('movieIds').notEmpty(), this.verifyJWT,
            MovieController.openMovieDetailAll)
    }

    private openAll() {
        return this.routes.get('/movie/open', this.verifyJWT, MovieController.openAll)
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

export default new MovieRouter()