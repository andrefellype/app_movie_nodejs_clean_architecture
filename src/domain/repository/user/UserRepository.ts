import User from "../../entity/user/User"

export default interface UserRepository {
    allByNotIdAndStatus(userIdValue: string, statusValue?: boolean): Promise<User[]>
    openByCodeRecovery(codeRecoveryValue: string): Promise<User>
    openByCellphoneAndPassword(cellphoneValue: string, passwordValue: string): Promise<User>
    openByCellphone(cellphoneValue: string): Promise<User>
}