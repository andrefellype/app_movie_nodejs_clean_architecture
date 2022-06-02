import Category from "../../entity/category/Category"

export default interface CategoryRepository {
    openByName(nameValue: string): Promise<Category>
    getAllByStatus(statusValue: boolean): Promise<Category[]>
}