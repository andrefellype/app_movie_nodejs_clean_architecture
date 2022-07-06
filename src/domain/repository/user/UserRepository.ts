import User from "../../entity/user/User"

export default interface UserRepository {
    findAllByNotIdAndStatus(userIdValue: string, statusValue?: boolean): Promise<User[]>

    findByCodeRecovery(codeRecoveryValue: string): Promise<User | null>

    findByCellphoneAndPassword(cellphoneValue: string, passwordValue: string): Promise<User | null>
    
    findByEmail(emailValue: string): Promise<User | null>
    
    findByCellphone(cellphoneValue: string): Promise<User | null>
}