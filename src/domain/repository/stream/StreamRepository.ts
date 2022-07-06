import Stream from "../../entity/stream/Stream"

export default interface StreamRepository {
    deleteAllByIds(ids: string[]): Promise<boolean>

    findAllByIds(ids: string[]): Promise<Stream[]>

    findByName(nameValue: string): Promise<Stream | null>
    
    findAllByStatus(statusValue: boolean): Promise<Stream[]>
}