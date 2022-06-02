import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from '../app/core/DataJsonResponse'
import DataReturnResponse from '../app/core/DataReturnResponse'
import AboutAppDAO from '../data/aboutApp/AboutAppDAO'

class AppController {
    public deleteAboutUs(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const aboutAppDAO = new AboutAppDAO()
            aboutAppDAO.deleteAll().then(valueDelete => {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }).catch(err => console.log(err))
        })
    }

    public updateAboutUs(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const aboutAppDAO = new AboutAppDAO()
                aboutAppDAO.update({ app: req.body.app, web: req.body.web, updated_at: ConvertData.getDateNowStr() })
                    .then(valueUpdate => {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                    }).catch(err => console.log(err))
            }
        })
    }

    public createAboutUs(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const aboutAppDAO = new AboutAppDAO()
                aboutAppDAO.create(req.body.app, req.body.web).then(value => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, value))
                }).catch(err => console.log(err))
            }
        })
    }

    public showAboutUs(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const aboutAppDAO = new AboutAppDAO()
            aboutAppDAO.openLast().then(async value => {
                const aboutApp = value != null ? value : null
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, aboutApp))
            }).catch(err => console.log(err))
        })
    }
}

export default new AppController()