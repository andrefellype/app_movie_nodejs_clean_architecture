import Country from "../../entity/country/Country"

export default interface CountryRepository {
    deleteAll(where: object): Promise<boolean>
    getAllByIds(ids: string[]): Promise<Country[]>
    openByName(nameValue: string): Promise<Country | null>
    getAllByStatus(statusValue: boolean): Promise<Country[]>
}