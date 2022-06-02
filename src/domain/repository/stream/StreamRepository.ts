import Stream from "../../entity/stream/Stream"

export default interface StreamRepository {
    deleteAll(where: object): Promise<boolean>
    getAllByIds(ids: string[]): Promise<Stream[]>
    openByName(nameValue: string): Promise<Stream>
    getAllByStatus(statusValue: boolean): Promise<Stream[]>
}