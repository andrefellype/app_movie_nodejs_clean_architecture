import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from '../app/core/DataJsonResponse'
import DataReturnResponse from '../app/core/DataReturnResponse'
import AboutUsDAO from '../data/aboutUs/AboutUsDAO'

class AboutUsController {
    public delete(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const aboutUsDAO = new AboutUsDAO()
            aboutUsDAO.deleteAll().then(valueDelete => {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }).catch(err => console.log(err))
        })
    }

    public update(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const aboutUsDAO = new AboutUsDAO()
                aboutUsDAO.update({ app: req.body.app, web: req.body.web, updated_at: ConvertData.getDateNowStr() })
                    .then(valueUpdate => {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
                    }).catch(err => console.log(err))
            }
        })
    }

    public create(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const aboutUsDAO = new AboutUsDAO()
                aboutUsDAO.create(req.body.app, req.body.web).then(value => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, value))
                }).catch(err => console.log(err))
            }
        })
    }

    public open(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const aboutUsDAO = new AboutUsDAO()
            aboutUsDAO.openLast().then(async value => {
                const aboutUs = value != null ? value : null
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, aboutUs))
            }).catch(err => console.log(err))
        })
    }
}

export default new AboutUsController()