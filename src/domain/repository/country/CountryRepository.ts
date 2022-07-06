import Country from "../../entity/country/Country"

export default interface CountryRepository {
    deleteAllByIds(ids: string[]): Promise<boolean>

    findAllByIds(ids: string[]): Promise<Country[]>

    findByInitial(initialValue: string): Promise<Country | null>
    
    findAllByStatus(statusValue: boolean): Promise<Country[]>
}