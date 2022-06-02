import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import ConvertData from '../app/core/ConvertData'
import DataJsonResponse from "../app/core/DataJsonResponse"
import DataReturnResponse from "../app/core/DataReturnResponse"
import { ObjectId } from 'mongodb'
import CategoryDAO from "../data/category/CategoryDAO"
import { CategoryGetObjectForJson } from '../domain/entity/category/CategoryConst'

class CategoryController {
    private static async deleteCategory(idsCategory: string[], categoryDAO: CategoryDAO) {
        const ids = idsCategory.map(i => new ObjectId(i))
        await categoryDAO.updateByWhere({ status: false, "updated_at": ConvertData.getDateNowStr() }, { _id: { $in: ids } })
    }

    public deleteSeveral(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const ids = JSON.parse(req.body._ids)
                await CategoryController.deleteCategory(ids, (new CategoryDAO()))
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
                await CategoryController.deleteCategory([req.body.categoryId], (new CategoryDAO()))
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res))
            }
        })
    }

    public update(req: Request, res: Response): Promise<string> {
        return new Promise((resolve, reject) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseValidationFail(res, errors.array({ onlyFirstError: true })))
            } else {
                const categoryDAO = new CategoryDAO()
                categoryDAO.updateByWhere({ name: req.body.name, updated_at: ConvertData.getDateNowStr() }, { _id: new ObjectId(req.body.categoryId) }).then(async valueUpdate => {
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
                categoryDAO.open(req.body.categoryId).then(async valueJson => {
                    DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseObjectJson(res, CategoryGetObjectForJson(valueJson)))
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

    public getAll(req: Request, res: Response): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const categoryDAO = new CategoryDAO()
            categoryDAO.getAllByStatus(true).then(async valuesJson => {
                DataReturnResponse.returnResolve(resolve, DataJsonResponse.responseArrayJson(res, valuesJson))
            }).catch(err => console.log(err))
        })
    }
}

export default new CategoryController()