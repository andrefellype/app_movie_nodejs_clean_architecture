import Director from "../../entity/director/Director"

export default interface DirectorRepository {
    deleteAll(where: object): Promise<boolean>
    getAllByIds(ids: string[]): Promise<Director[]>
    openByName(nameValue: string): Promise<Director>
    getAllByStatus(statusValue: boolean): Promise<Director[]>
}