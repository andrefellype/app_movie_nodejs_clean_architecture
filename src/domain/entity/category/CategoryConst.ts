import Category from "./Category"

export const CATEGORY_NAME_OBJECT = "categories"

export function CategorySetObjectDB(nameValue: string, statusValue: boolean, createdAtValue: string, updatedAtValue: string | null = null) {
    return {
        name: nameValue,
        status: statusValue,
        created_at: createdAtValue,
        updated_at: updatedAtValue
    }
}

export function CategoryGetObjectForJson(category: Category) {
    return {
        _id: category._id,
        name: category.name,
        status: category.status,
        created_at: category.created_at,
        updated_at: category.updated_at
    }
}