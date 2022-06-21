import Stream from "../../entity/stream/Stream"

export default interface StreamRepository {
    deleteAllByIds(ids: string[]): Promise<boolean>
    getAllByIds(ids: string[]): Promise<Stream[]>
    openByName(nameValue: string): Promise<Stream | null>
    getAllByStatus(statusValue: boolean): Promise<Stream[]>
}