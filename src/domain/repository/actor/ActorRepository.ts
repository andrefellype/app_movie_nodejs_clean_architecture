import Actor from "../../entity/actor/Actor"

export default interface ActorRepository {
    deleteAllByIds(ids: string[]): Promise<boolean>
    getAllByIds(ids: string[]): Promise<Actor[]>
    openByName(nameValue: string): Promise<Actor | null>
    getAllByStatus(statusValue: boolean): Promise<Actor[]>
}