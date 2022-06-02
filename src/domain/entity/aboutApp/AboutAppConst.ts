export const ABOUT_APP_NAME_OBJECT = "about_apps"

export function AboutAppSetObjectDB(app: string, web: string, createdAt: string, updatedAt: string | null = null) {
    return {
        app: app,
        web: web,
        created_at: createdAt,
        updated_at: updatedAt
    }
}