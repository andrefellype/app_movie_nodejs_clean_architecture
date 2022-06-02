import { Response } from 'express'

export default class DataJsonResponse {
    public static responseArrayJson<T>(res: Response, valueList: Array<T>) {
        return res.status(200).json(this.responseArray(valueList))
    }

    public static responseObjectJson<T>(res: Response, valueObject?: T) {
        return res.status(200).json(this.responseObject(valueObject))
    }

    public static responseValidationFail(res: Response, errors) {
        return res.status(200).json(this.responseArray(errors, false))
    }

    public static responseArray<T>(valueList: Array<T>, status = true) {
        return {
            datas: status ? valueList : null,
            errors: !status ? valueList : null,
            status: status
        }
    }

    public static responseObject<T>(valueObject?: T, status = true) {
        return {
            data: valueObject,
            errors: null,
            status: status
        }
    }
}
