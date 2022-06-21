import Director from "../../entity/director/Director"

export default interface DirectorRepository {
    deleteAllByIds(ids: string[]): Promise<boolean>
    getAllByIds(ids: string[]): Promise<Director[]>
    openByName(nameValue: string): Promise<Director | null>
    getAllByStatus(statusValue: boolean): Promise<Director[]>
}