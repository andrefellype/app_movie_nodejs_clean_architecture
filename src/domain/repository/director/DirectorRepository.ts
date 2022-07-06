import Director from "../../entity/director/Director"

export default interface DirectorRepository {
    deleteAllByIds(ids: string[]): Promise<boolean>

    findAllByIds(ids: string[]): Promise<Director[]>

    findByName(nameValue: string): Promise<Director | null>
    
    findAllByStatus(statusValue: boolean): Promise<Director[]>
}