import Stream from "./Stream"

export const STREAM_NAME_OBJECT = "streams"

export function SetStreamDB(nameValue: string, userRegister: object, reviewedValue: boolean, statusValue: boolean, createdAtValue: string) {
    return {
        name: nameValue,
        user_register: userRegister,
        reviewed: reviewedValue,
        status: statusValue,
        created_at: createdAtValue,
        updated_at: null
    }
}

export function GetStreamByJson(stream: Stream, userId?: string) {
    return {
        _id: stream._id,
        name: stream.name,
        user_register: stream.user_register,
        reviewed: stream.reviewed,
        status: stream.status,
        created_at: stream.created_at,
        updated_at: stream.updated_at,
        enabledEdit: (!stream.reviewed && userId != null && userId == stream.user_register)
    }
}