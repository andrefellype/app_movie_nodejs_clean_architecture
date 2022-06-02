export default interface CrudRepository<T> {
    delete(idDelete: string): Promise<boolean>
    updateByWhere(data: object, where: object): Promise<boolean>
    open(idOpen: string): Promise<T>
    create(...params): Promise<string>
    getAll(): Promise<T[]>
}