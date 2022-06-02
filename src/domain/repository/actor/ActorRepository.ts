import Actor from "../../entity/actor/Actor"

export default interface ActorRepository {
    deleteAll(where: object): Promise<boolean>
    getAllByIds(ids: string[]): Promise<Actor[]>
    openByName(nameValue: string): Promise<Actor>
    getAllByStatus(statusValue: boolean): Promise<Actor[]>
}