import Country from "./Country"

export const COUNTRY_NAME_OBJECT = "countries"

export function CountrySetObjectDB(nameValue: string, userRegister: object, reviewedValue: boolean, statusValue: boolean, createdAtValue: string, updatedAtValue: string | null = null) {
    return {
        name: nameValue,
        user_register: userRegister,
        reviewed: reviewedValue,
        status: statusValue,
        created_at: createdAtValue,
        updated_at: updatedAtValue
    }
}

export function CountryGetObjectForJson(country: Country, userId?: string) {
    return {
        _id: country._id,
        name: country.name,
        user_register: country.user_register,
        reviewed: country.reviewed,
        status: country.status,
        created_at: country.created_at,
        updated_at: country.updated_at,
        enabledEdit: (!country.reviewed && userId != null && userId == country.user_register)
    }
}