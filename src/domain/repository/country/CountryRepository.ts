import Country from "../../entity/country/Country"

export default interface CountryRepository {
    deleteAllByIds(ids: string[]): Promise<boolean>
    getAllByIds(ids: string[]): Promise<Country[]>
    openByInitial(initialValue: string): Promise<Country | null>
    getAllByStatus(statusValue: boolean): Promise<Country[]>
}