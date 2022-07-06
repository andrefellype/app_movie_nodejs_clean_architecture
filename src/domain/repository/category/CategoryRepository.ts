import Category from "../../entity/category/Category"

export default interface CategoryRepository {
    findByName(nameValue: string): Promise<Category | null>
    
    findAllByStatus(statusValue: boolean): Promise<Category[]>
}