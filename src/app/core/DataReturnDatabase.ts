import { ObjectId } from "mongodb"

export default class DataReturnDatabase {

    public status: boolean
    public count: number
    public idRegister: ObjectId

    public static setObject(status: boolean = false, count: number = null, idRegister: ObjectId = null): DataReturnDatabase {
        let dataReturnDatabase = new DataReturnDatabase()
        dataReturnDatabase.status = status
        dataReturnDatabase.count = count
        dataReturnDatabase.idRegister = idRegister
        return dataReturnDatabase
    }
}