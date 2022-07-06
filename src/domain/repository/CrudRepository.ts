export default interface CrudRepository<T> {
    deleteById(idDelete: string): Promise<boolean>

    updateByWhere(data: object, where: object): Promise<boolean>

    updateByIds(data: object, ids: string[]): Promise<boolean>

    updateById(data: object, id: string): Promise<boolean>

    find(idOpen: string): Promise<T|null>

    create(...params): Promise<string>
    
    findAll(): Promise<T[]>
}