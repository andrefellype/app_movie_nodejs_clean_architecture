import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import CategoryDAO from "../data/category/CategoryDAO"
import { GetCategoryByJson } from '../domain/entity/category/CategoryConst'

class CategoryController {
    private static async deleteLocalByIds(idsCategory: string[], categoryDAO: CategoryDAO) {
        await categoryDAO.updateByIds({ status: false, "updated_at": ConvertData.getDateNowStr() }, idsCategory)
    }

    public deleteById(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                let categoryIds: string[] = []
                if (typeof req.route.methods.put != "undefined" && req.route.methods.put) {
                    categoryIds = JSON.parse(req.body.categoryId)
                } else {
                    categoryIds.push(req.params.categoryId)
                }
                await CategoryController.deleteLocalByIds(categoryIds, (new CategoryDAO()))
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public updateById(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve,
                    DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const categoryDAO = new CategoryDAO()
                categoryDAO.updateById({ name: req.body.name, updated_at: ConvertData.getDateNowStr() },
                    req.params.categoryId).then(async valueUpdate => {
                        DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
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
                const categoryDAO = new CategoryDAO()
                categoryDAO.find(req.params.categoryId).then(async valueJson => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, GetCategoryByJson(valueJson!!)))
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
                const categoryDAO = new CategoryDAO()
                categoryDAO.create(req.body.name, ConvertData.getDateNowStr()).then(async valueId => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, valueId))
                }).catch(err => console.log(err))
            }
        })
    }

    public openAll(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const categoryDAO = new CategoryDAO()
            categoryDAO.findAllByStatus(true).then(async valuesJson => {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, valuesJson))
            }).catch(err => console.log(err))
        })
    }
}

export default new CategoryController()