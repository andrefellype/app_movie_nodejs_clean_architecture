import AboutApp from "../../entity/aboutApp/AboutApp"

export default interface AboutAppRepository {
    deleteAll(): Promise<boolean>
    update(data: object): Promise<boolean>
    openLast(): Promise<AboutApp | null>
}