import fs from 'fs'
import csv from 'csv-parser'

export default class ReadCsv {
    public static async read(fileCsv: string, callbackSuccess: (row: any) => void, callbackFinish: () => (void | null) = () => null) {
        await fs.createReadStream(fileCsv).pipe(csv()).on('data', callbackSuccess).on('end', callbackFinish)
    }
}