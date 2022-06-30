import DataReturnResponse from "../core/DataReturnResponse"

export default class Database {

    private static uriDb_SERVER = process.env.MONGODB_URI
    private static uriDb_LOCAL = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
    private static uriDb = this.uriDb_LOCAL
    private static databaseDb_LOCAL = "appmovie"
    private static databaseDb = Database.databaseDb_LOCAL

    private static connectDb() {
        const mongoc = require("mongodb").MongoClient
        const client = new mongoc(this.uriDb, { useNewUrlParser: true, useUnifiedTopology: true })
        return client
    }

    public static updateNameFieldByObject(nameObject: string, namesUpdate: object = {}) {
        return new Promise(async (resolve, reject) => {
            const connection = await this.connectDb()
            await connection.connect()
            const database = await connection.db(this.databaseDb)
            const collection = await database.collection(nameObject)
            await collection.updateMany({}, { $rename: namesUpdate }).then(async value => {
                await connection.close()
                DataReturnResponse.returnResolve(resolve, value.modifiedCount)
            })
        })
    }

    public static removeFields(nameObject: string, fields = {}) {
        return new Promise(async (resolve, reject) => {
            const connection = await this.connectDb()
            await connection.connect()
            const database = await connection.db(this.databaseDb)
            await database.collection(nameObject).updateMany({}, { $unset: fields })
            DataReturnResponse.returnResolve(resolve, true)
        })
    }

    public static countByWhere(nameObject: string, where: object = {}) {
        return this.countFields(nameObject, where)
    }

    public static count(nameObject: string) {
        return this.countFields(nameObject)
    }

    private static countFields(nameObject: string, where: object = {}) {
        return new Promise(async (resolve, reject) => {
            const connection = await this.connectDb()
            await connection.connect()
            const database = await connection.db(this.databaseDb)
            const collection = await database.collection(nameObject)
            collection.countDocuments(where).then(value => {
                connection.close()
                DataReturnResponse.returnResolve(resolve, value)
            })
        })
    }

    public static delete(nameObject: string) {
        return this.deleteFields(nameObject)
    }

    public static deleteByWhere(nameObject: string, where: object | null = null) {
        return this.deleteFields(nameObject, where)
    }

    private static deleteFields(nameObject: string, where: object | null = {}) {
        return new Promise(async (resolve, reject) => {
            if (where != null) {
                const connection = await this.connectDb()
                await connection.connect()
                const database = await connection.db(this.databaseDb)
                const collection = await database.collection(nameObject)
                await collection.deleteMany(where).then(async (value) => {
                    await connection.close()
                    DataReturnResponse.returnResolve(resolve, value.deletedCount)
                })
            } else {
                DataReturnResponse.returnResolve(resolve, 0)
            }
        })
    }

    public static allByWhereAndFields(nameObject: string, where: object = {}, orderBy: object | null = null, fields = {}) {
        if (orderBy != null) {
            return this.allFields(nameObject, where, orderBy, null, fields)
        }
        return this.allFields(nameObject, where, null, null, fields)
    }

    public static allByWhere(nameObject: string, where: object = {}, orderBy: object | null = null) {
        if (orderBy != null) {
            return this.allFields(nameObject, where, orderBy)
        }
        return this.allFields(nameObject, where)
    }

    public static all(nameObject: string, orderBy: object | null = null) {
        if (orderBy != null) {
            return this.allFields(nameObject, null, orderBy)
        }
        return this.allFields(nameObject)
    }

    private static allFields(nameObject: string, where: object | null = {}, orderBy: object | null = {}, limit = null, fields = {}) {
        return new Promise(async (resolve, reject) => {
            const connection = await this.connectDb()
            await connection.connect()
            const database = await connection.db(this.databaseDb)
            const options = { projection: fields, sort: orderBy, limit: limit }
            const collection = await database.collection(nameObject)
            collection.find(where, options).toArray((err, result) => {
                if (err) {
                    connection.close()
                    DataReturnResponse.returnReject(reject, new Error(JSON.stringify(err)))
                } else {
                    connection.close()
                    DataReturnResponse.returnResolve(resolve, result)
                }
            })
        })
    }

    public static update(nameObject: string, data: object = {}) {
        return this.updateFields(nameObject, data)
    }

    public static updateByWhere(nameObject: string, data: object = {}, where: object | null = null) {
        return this.updateFields(nameObject, data, where)
    }

    private static updateFields(nameObject: string, data = {}, where: object | null = {}) {
        return new Promise(async (resolve, reject) => {
            const connection = await this.connectDb()
            await connection.connect()
            const database = await connection.db(this.databaseDb)
            const collection = await database.collection(nameObject)
            if (where != null) {
                await collection.updateMany(where, { $set: data }).then(async value => {
                    await connection.close()
                    DataReturnResponse.returnResolve(resolve, value.modifiedCount)
                })
            } else {
                DataReturnResponse.returnResolve(resolve, 0)
            }
        })
    }

    public static openByLast(nameObject: string) {
        return this.openObject(nameObject, {}, { _id: -1 })
    }

    public static openByWhere(nameObject: string, where: object = {}) {
        return this.openObject(nameObject, where)
    }

    private static openObject(nameObject: string, where = {}, orderBy = {}, fields = {}) {
        return new Promise(async (resolve, reject) => {
            const connection = await this.connectDb()
            await connection.connect()
            const database = await connection.db(this.databaseDb)
            const options = { projection: fields, sort: orderBy }
            const collection = await database.collection(nameObject)
            collection.findOne(where, options).then(value => {
                connection.close()
                DataReturnResponse.returnResolve(resolve, value)
            })
        })
    }

    public static insert(nameObject: string, data: object = {}) {
        return new Promise(async (resolve, reject) => {
            const connection = await this.connectDb()
            await connection.connect()
            const database = await connection.db(this.databaseDb)
            const collection = await database.collection(nameObject)
            await collection.insertOne(data).then(async value => {
                await connection.close()
                DataReturnResponse.returnResolve(resolve, value.insertedId)
            })
        })
    }

    public static insertMany(nameObject: string, datas: Array<any> = []) {
        return new Promise(async (resolve, reject) => {
            const connection = await this.connectDb()
            await connection.connect()
            const database = await connection.db(this.databaseDb)
            const collection = await database.collection(nameObject)
            await collection.insertMany(datas, { ordered: true }).then(async value => {
                await connection.close()
                DataReturnResponse.returnResolve(resolve, value.insertedCount)
            })
        })
    }
}