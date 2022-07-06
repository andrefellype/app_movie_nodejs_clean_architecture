import Actor from "./Actor"

export const ACTOR_NAME_OBJECT = "actors"

export function SetActorDB(nameValue: string, userRegister: object, reviewedValue: boolean, statusValue: boolean, createdAtValue: string) {
    return {
        name: nameValue,
        user_register: userRegister,
        reviewed: reviewedValue,
        status: statusValue,
        created_at: createdAtValue,
        updated_at: null
    }
}

export function GetActorByJson(actor: Actor, userId?: string) {
    return {
        _id: actor._id,
        name: actor.name,
        user_register: actor.user_register,
        reviewed: actor.reviewed,
        status: actor.status,
        created_at: actor.created_at,
        updated_at: actor.updated_at,
        enabledEdit: (!actor.reviewed && userId != null && userId == actor.user_register)
    }
}