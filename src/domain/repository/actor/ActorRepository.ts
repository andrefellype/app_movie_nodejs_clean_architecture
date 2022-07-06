import Actor from "../../entity/actor/Actor"

export default interface ActorRepository {
    deleteAllByIds(ids: string[]): Promise<boolean>

    findAllByIds(ids: string[]): Promise<Actor[]>

    findByName(nameValue: string): Promise<Actor | null>
    
    findAllByStatus(statusValue: boolean): Promise<Actor[]>
}