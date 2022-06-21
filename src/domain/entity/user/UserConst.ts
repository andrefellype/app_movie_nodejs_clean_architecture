import User from "./user"

export const USER_NAME_OBJECT = "users"

export function UserSetObjectDB(
    nameValue: string, birthValue: string, emailValue: string, cellphoneValue: string, passwordValue: string, levelValue: string, codeRecoveryValue: string | null, enabledValue: boolean, statusValue: boolean,
    createdAtValue: string, lastAccessAtValue: string | null = null
) {
    return {
        name: nameValue,
        birth: birthValue,
        email: emailValue,
        cellphone: cellphoneValue,
        password: passwordValue,
        level: levelValue,
        code_recovery: codeRecoveryValue,
        enabled: enabledValue,
        status: statusValue,
        created_at: createdAtValue,
        updated_at: null,
        last_access_at: lastAccessAtValue
    }
}

export function UserGetObjectForJson(user: User, token?: String) {
    return {
        _id: user._id,
        name: user.name,
        birth: user.birth,
        email: user.email,
        cellphone: user.cellphone,
        password: user.password,
        level: user.level,
        code_recovery: user.code_recovery,
        enabled: user.enabled,
        status: user.status,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_access_at: user.last_access_at,
        token: token
    }
}