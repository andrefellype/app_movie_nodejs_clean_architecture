import User from "../../entity/user/User"

export default interface UserRepository {
    allByNotIdAndStatus(userIdValue: string, statusValue?: boolean): Promise<User[]>
    openByCodeRecovery(codeRecoveryValue: string): Promise<User | null>
    openByCellphoneAndPassword(cellphoneValue: string, passwordValue: string): Promise<User | null>
    openByEmail(emailValue: string): Promise<User | null>
    openByCellphone(cellphoneValue: string): Promise<User | null>
}