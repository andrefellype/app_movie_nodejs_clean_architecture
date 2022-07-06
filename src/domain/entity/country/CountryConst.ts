import Country from "./Country"

export const COUNTRY_NAME_OBJECT = "countries"

export function SetCountryDB(initialValue: string, userRegister: object, reviewedValue: boolean, statusValue: boolean, createdAtValue: string) {
    return {
        initial: initialValue,
        user_register: userRegister,
        reviewed: reviewedValue,
        status: statusValue,
        created_at: createdAtValue,
        updated_at: null
    }
}

export function GetCountryByJson(country: Country, userId?: string) {
    return {
        _id: country._id,
        initial: country.initial,
        user_register: country.user_register,
        reviewed: country.reviewed,
        status: country.status,
        created_at: country.created_at,
        updated_at: country.updated_at,
        enabledEdit: (!country.reviewed && userId != null && userId == country.user_register)
    }
}