import { ObjectId } from "mongodb"

export default class DataReturnDatabase {

    public status: boolean
    public count: number | null
    public idRegister: ObjectId | null

    public static setObject(status: boolean = false, count: number | null = null, idRegister: ObjectId | null = null): DataReturnDatabase {
        let dataReturnDatabase = new DataReturnDatabase()
        dataReturnDatabase.status = status
        dataReturnDatabase.count = count
        dataReturnDatabase.idRegister = idRegister
        return dataReturnDatabase
    }
}