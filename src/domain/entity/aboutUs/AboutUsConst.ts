export const ABOUT_US_NAME_OBJECT = "about_us"

export function AboutUsSetObjectDB(app: string, web: string, createdAt: string) {
    return {
        app: app,
        web: web,
        created_at: createdAt,
        updated_at: null
    }
}