import Director from "./Director"

export const DIRECTOR_NAME_OBJECT = "directors"

export function DirectorSetObjectDB(nameValue: string, userRegister: object, reviewedValue: boolean, statusValue: boolean, createdAtValue: string) {
    return {
        name: nameValue,
        user_register: userRegister,
        reviewed: reviewedValue,
        status: statusValue,
        created_at: createdAtValue,
        updated_at: null
    }
}

export function DirectorGetObjectForJson(director: Director, userId?: string) {
    return {
        _id: director._id,
        name: director.name,
        user_register: director.user_register,
        reviewed: director.reviewed,
        status: director.status,
        created_at: director.created_at,
        updated_at: director.updated_at,
        enabledEdit: (!director.reviewed && userId != null && userId == director.user_register)
    }
}